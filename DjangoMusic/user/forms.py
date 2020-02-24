from django import forms
from django.contrib.auth.models import User
import re

def email_check(email):
    pattern = re.compile(r'\"?([-a-zA-Z0-9.`?{}]+@\w+\.\w+)\"?')
    return re.match(pattern, email)

class RegisterationForm(forms.Form):
    username = forms.CharField(label='Username', max_length=50)
    nickname = forms.CharField(label='Nickname', max_length=50)
    email = forms.EmailField(label='Email')
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
    password2 = forms.CharField(label='Password Confirmation', widget=forms.PasswordInput)

    def clean_username(self):
        username = self.cleaned_data.get('username')

        if len(username) < 6:
            raise forms.ValidationError('用户名不得少于6个字符')
        elif len(username) > 50:
            raise forms.ValidationError('用户名不得超过50个字符')
        else:
            filter_result = User.objects.filter(username=username)
            if len(filter_result) > 0:
                raise forms.ValidationError('该用户名已存在')
        return username

    def clean_nickname(self):
        nickname = self.cleaned_data.get('nickname')
        if len(nickname) == 0:
            nickname = self.cleaned_data.get('username')
        if len(nickname) > 50:
            raise forms.ValidationError('昵称不得超过50个字符')

        return nickname

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if email_check(email):
            filter_result = User.objects.filter(email=email)
            if len(filter_result) > 0:
                raise forms.ValidationError('该邮箱已被注册')
        else:
            raise forms.ValidationError('请输入有效的email')
        return email
    
    def clean_password1(self):
        pwd1 = self.cleaned_data.get('password1')
        if len(pwd1) < 6:
            raise forms.ValidationError('密码不得少于6个字符')
        elif len(pwd1) > 20:
            raise forms.ValidationError('密码不得超过20个字符')
        return pwd1

    def clean_password2(self):
        pwd1 = self.cleaned_data.get('password1')
        pwd2 = self.cleaned_data.get('password2')

        if pwd1 and pwd2 and pwd1 != pwd2:
            raise forms.ValidationError('密码错误，请重新输入')

        return pwd2

class LoginForm(forms.Form):
    username = forms.CharField(label='Username', max_length=50)
    password = forms.CharField(label='Password', widget=forms.PasswordInput)
    
    def clean_username(self):
        username = self.cleaned_data.get('username')

        if email_check(username):
            # 输入的是email
            filter_result = User.objects.filter(email=username)
            if not filter_result:
                raise forms.ValidationError('该邮箱不存在')
        else:
            filter_result = User.objects.filter(username=username)
            if not filter_result:
                raise forms.ValidationError('该用户名不存在，请先注册')
        
        return username