from django import forms

class GameSettingsForm(forms.Form):
    BONUS_CHOICES = [(True, 'On'), (False, 'Off')]
    WALLS_CHOICES = [(True, 'On'), (False, 'Off')]
    COLOR_CHOICES = [('white', 'White'), ('red', 'Red'), ('green', 'Green'), ('blue', 'Blue')]

    bonus = forms.ChoiceField(choices=BONUS_CHOICES, widget=forms.RadioSelect)
    walls = forms.ChoiceField(choices=WALLS_CHOICES, widget=forms.RadioSelect)
    player1_color = forms.ChoiceField(choices=COLOR_CHOICES)
    player2_color = forms.ChoiceField(choices=COLOR_CHOICES)
    ball_color = forms.ChoiceField(choices=COLOR_CHOICES)
    ball_speed = forms.IntegerField(widget=forms.NumberInput(attrs={'type':'range', 'min': 3, 'max': 10}))