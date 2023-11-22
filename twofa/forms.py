from django import forms

class Form2FA(forms.Form):
	code = forms.CharField(max_length=6, min_length=6, widget=forms.TextInput(attrs={'pattern': '[0-9]{6}', 'title': 'Please enter your 2FA code.'}))