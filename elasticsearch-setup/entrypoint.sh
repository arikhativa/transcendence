#!/usr/bin/env bash

set -eu
set -o pipefail

source /lib.sh

# --------------------------------------------------------
# Users declarations

declare -A users_passwords
users_passwords=(
	[logstash_internal]="${LOGSTASH_INTERNAL_PASSWORD:-}"
	[kibana_system]="${KIBANA_SYSTEM_PASSWORD:-}"
	[kibana_viewer]="${KIBANA_VIEWER_PASSWORD:-}"
	# [metricbeat_internal]="${METRICBEAT_INTERNAL_PASSWORD:-}"
	# [filebeat_internal]="${FILEBEAT_INTERNAL_PASSWORD:-}"
	# [heartbeat_internal]="${HEARTBEAT_INTERNAL_PASSWORD:-}"
	[monitoring_internal]="${MONITORING_INTERNAL_PASSWORD:-}"
	# [beats_system]="${BEATS_SYSTEM_PASSWORD=:-}"
)

declare -A users_roles
users_roles=(
	[logstash_internal]='logstash_writer'
	[kibana_viewer]='viewer'
	# [metricbeat_internal]='metricbeat_writer'
	# [filebeat_internal]='filebeat_writer'
	# [heartbeat_internal]='heartbeat_writer'
	[monitoring_internal]='remote_monitoring_collector'
)

# --------------------------------------------------------
# Roles declarations

declare -A roles_files
roles_files=(
	[logstash_writer]='logstash_writer.json'
	# [metricbeat_writer]='metricbeat_writer.json'
	# [filebeat_writer]='filebeat_writer.json'
	# [heartbeat_writer]='heartbeat_writer.json'
)

declare -A policy_files
policy_files=(
	[delete_after_1_day]='delete_after_1_day.json'
)

declare -A templates_files
templates_files=(
	[django]='django.json'
)

declare -A kibana_files
kibana_files=(
	[django_dashboard]='django.ndjson'
)

# --------------------------------------------------------
# ------------------------- Elastic ----------------------
# --------------------------------------------------------

log 'Waiting for availability of Elasticsearch. This can take several minutes.'

declare -i exit_code=0
wait_for_elasticsearch || exit_code=$?

if ((exit_code)); then
	case $exit_code in
		6)
			suberr 'Could not resolve host. Is Elasticsearch running?'
			;;
		7)
			suberr 'Failed to connect to host. Is Elasticsearch healthy?'
			;;
		28)
			suberr 'Timeout connecting to host. Is Elasticsearch healthy?'
			;;
		*)
			suberr "Connection to Elasticsearch failed. Exit code: ${exit_code}"
			;;
	esac

	exit $exit_code
fi

sublog 'Elasticsearch is running'

log 'Waiting for initialization of built-in users'

wait_for_builtin_users || exit_code=$?

if ((exit_code)); then
	suberr 'Timed out waiting for condition'
	exit $exit_code
fi

sublog 'Built-in users were initialized'

for role in "${!roles_files[@]}"; do
	log "Role '$role'"

	declare body_file
	body_file="/roles/${roles_files[$role]:-}"
	if [[ ! -f "${body_file:-}" ]]; then
		sublog "No role body found at '${body_file}', skipping"
		continue
	fi

	sublog 'Creating/updating'
	ensure_role "$role" "$(<"${body_file}")"
done

for user in "${!users_passwords[@]}"; do
	log "User '$user'"
	if [[ -z "${users_passwords[$user]:-}" ]]; then
		sublog 'No password defined, skipping'
		continue
	fi

	declare -i user_exists=0
	user_exists="$(check_user_exists "$user")"

	if ((user_exists)); then
		sublog 'User exists, setting password'
		set_user_password "$user" "${users_passwords[$user]}"
	else
		if [[ -z "${users_roles[$user]:-}" ]]; then
			suberr '  No role defined, skipping creation'
			continue
		fi

		sublog 'User does not exist, creating'
		create_user "$user" "${users_passwords[$user]}" "${users_roles[$user]}"
	fi
done

log 'Creating ILM Policies'

for p in "${!policy_files[@]}"; do
	log "Policy '$p'"

	declare body_file1
	body_file1="/policies/${policy_files[$p]:-}"
	if [[ ! -f "${body_file1:-}" ]]; then
		sublog "No policy body found at '${body_file1}', skipping"
		continue
	fi

	sublog 'Creating'
	create_ilm_policy "$p" "$(<"${body_file1}")"
done

log 'Creating Index Template'

for temp in "${!templates_files[@]}"; do
	log "Template '$temp'"

	declare body_file
	body_file="/templates/${templates_files[$temp]:-}"
	if [[ ! -f "${body_file:-}" ]]; then
		sublog "No template body found at '${body_file}', skipping"
		continue
	fi

	sublog 'Creating'
	create_index_template "$temp" "$(<"${body_file}")"
done




# ------------------------------------------------------------------------------
# -------------------------------- Kibana --------------------------------------
# ------------------------------------------------------------------------------


log 'Waiting for availability of Kibana. This can take several minutes.'

exit_code=0
wait_for_kibana || exit_code=$?

if ((exit_code)); then
	case $exit_code in
		6)
			suberr 'Could not resolve host. Is Kibana running?'
			;;
		7)
			suberr 'Failed to connect to host. Is Kibana healthy?'
			;;
		28)
			suberr 'Timeout connecting to host. Is Kibana healthy?'
			;;
		*)
			suberr "Connection to Kibana failed. Exit code: ${exit_code}"
			;;
	esac

	exit $exit_code
fi

for d in "${!kibana_files[@]}"; do
	log "Kibana '$d'"

	declare body_file
	body_file="/kibana/${kibana_files[$d]:-}"
	if [[ ! -f "${body_file:-}" ]]; then
		sublog "No Kibana object body found at '${body_file}', skipping"
		continue
	fi

	sublog 'Importing'
	create_kibana_objects "/kibana/${kibana_files[$d]}"
done
