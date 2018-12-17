from django import forms

class UploadImageForm(forms.form):
    title = forms.CharField(max_length = 50)
    image = forms.ImageField()
