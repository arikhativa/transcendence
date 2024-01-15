from django import forms

class Form2FA(forms.Form):
	code = forms.CharField(
		label='',
		max_length=6,
		min_length=6,
		widget=forms.TextInput(attrs={'pattern': '[0-9]{6}', 'title': 'Please enter your 2FA code.'})
	)

class FormPhone(forms.Form):
	phone = forms.CharField(
		label='',
		max_length=17,
		widget=forms.TextInput(attrs={'pattern': r'^\+?[1-9]\d{1,16}$', 'title': 'Please enter a valid phone number.'})
	)

class Form2FAEmail(forms.Form):#6 character code numbers and letters
	code = forms.CharField(
		label='',
		max_length=6,
		min_length=6,
		widget=forms.TextInput(attrs={'pattern': '[0-9a-zA-Z]{6}', 'title': 'Please enter your 2FA code.'})
	)