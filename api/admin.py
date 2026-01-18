from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

User = get_user_model()


class UserAdmin(BaseUserAdmin):
    # Fields to display in the user list
    list_display = ('username', 'email', 'is_staff', 'is_active')

    # Fields to include when creating a new user
    add_fieldsets = (
        (
            None,
            {
                'classes': ('wide',),
                'fields': ('username', 'email', 'password1', 'password2'),
            },
        ),
    )


admin.site.register(User, UserAdmin)
