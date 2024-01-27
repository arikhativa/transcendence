from django import forms

class GameSettingsForm(forms.Form):
    ballColor = forms.CharField(label="ballColor", max_length=1)