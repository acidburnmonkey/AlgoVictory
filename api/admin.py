from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from api.models import User


class UserAdmin(BaseUserAdmin):
    # Fields to display in the user list
    list_display = ('username', 'email', 'is_staff', 'is_active', 'premium', 'payment_date', 'payment_expires')

    fieldsets = BaseUserAdmin.fieldsets + (  # type: ignore[operator]
        (
            'Premium Info',
            {
                'fields': ('premium', 'payment_date', 'payment_expires'),
            },
        ),
    )

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
