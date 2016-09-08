from datetime import datetime
from django.db import models

# Create your models here.


class AuthMenuLevel(models.Model):
    leve_id = models.AutoField(primary_key=True)
    level_name = models.CharField(max_length=32)

    class Meta:
        managed = False
        db_table = 'tb_auth_menu_level'


class AuthMenu(models.Model):
    menu_id = models.IntegerField(primary_key=True)
    menu_title = models.CharField(max_length=255)
    menu_level = models.ForeignKey(AuthMenuLevel, on_delete=models.DO_NOTHING, verbose_name="菜单级别", db_column="menu_level")
    menu_url = models.CharField(max_length=50)
    parent_id = models.IntegerField()
    content = models.CharField(max_length=500, blank=True, null=True)
    weight = models.IntegerField(blank=True, null=True)
    type = models.CharField(max_length=6, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tb_auth_menu'


class AuthPrivilege(models.Model):
    privilege_id = models.AutoField(primary_key=True)
    privilege_title = models.CharField(max_length=25)
    menu_id = models.IntegerField()
    action = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'tb_auth_privilege'


class AuthRole(models.Model):
    role_id = models.AutoField(primary_key=True)
    role_name = models.CharField(max_length=25)
    role_shortname = models.CharField(max_length=25)
    belong_id = models.CharField(max_length=11, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tb_auth_role'


class AuthRolePrivilege(models.Model):
    role_id = models.IntegerField(primary_key=True, unique=False)
    privilege_id = models.IntegerField(primary_key=True, unique=False)

    class Meta:
        managed = False
        db_table = 'tb_auth_role_privilege'
        unique_together = (('role_id', 'privilege_id'),)


class AuthUserRole(models.Model):
    user_id = models.IntegerField()
    role_id = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'tb_auth_user_role'
        unique_together = (('user_id', 'role_id'),)


class Commodity(models.Model):
    commodity_no = models.CharField(max_length=32, blank=True, null=True)
    commodity_name = models.CharField(max_length=32, blank=True, null=True)
    gmt_create = models.CharField(max_length=32, blank=True, null=True)
    document_no = models.CharField(max_length=32, blank=True, null=True)
    supplier_company = models.CharField(max_length=32, blank=True, null=True)
    supplier_ab = models.CharField(max_length=16, blank=True, null=True)
    department = models.CharField(max_length=32, blank=True, null=True)
    storehouse_name = models.CharField(max_length=32, blank=True, null=True)
    applier_name = models.CharField(max_length=32, blank=True, null=True)
    auditor_name = models.CharField(max_length=32, blank=True, null=True)
    applier_id = models.IntegerField(blank=True, null=True)
    auditor_id = models.IntegerField(blank=True, null=True)
    memo = models.CharField(max_length=64, blank=True, null=True)
    gmt_modified = models.DateTimeField(blank=True, null=True,default=datetime.now())
    stock_num = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tb_commodity'


class Sale(models.Model):
    commodity_no = models.CharField(max_length=32, blank=True, null=True)
    commodity_batch = models.CharField(max_length=64, blank=True, null=True)
    sale_date = models.CharField(max_length=32,blank=True, null=True)
    saler_id = models.IntegerField(blank=True, null=True)
    saler_name = models.CharField(max_length=32, blank=True, null=True)
    storage_id = models.CharField(max_length=32, blank=True, null=True)
    price = models.FloatField(blank=True, null=True)
    num = models.IntegerField(blank=True, null=True)
    unit_relation = models.CharField(max_length=10, blank=True, null=True)
    unit = models.CharField(max_length=32, blank=True, null=True)
    memo = models.CharField(max_length=32, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tb_sale'


class Storage(models.Model):
    commodity_no = models.CharField(max_length=32, blank=True, null=True)
    commodity_batch = models.CharField(max_length=64, blank=True, null=True)
    commodity_name = models.CharField(max_length=32, blank=True, null=True)
    gmt_create = models.CharField(max_length=32, blank=True, null=True)
    supplier_relation = models.CharField(max_length=32, blank=True, null=True)
    direction = models.CharField(max_length=16, blank=True, null=True)
    storage = models.CharField(max_length=32, blank=True, null=True)
    unit = models.CharField(max_length=32, blank=True, null=True)
    max_times = models.IntegerField(blank=True, null=True)
    price = models.FloatField(blank=True, null=True)
    num = models.IntegerField(blank=True, null=True)
    memo = models.CharField(max_length=64, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tb_storage'


class User(models.Model):
    user_name = models.CharField(unique=True, max_length=32, blank=True, null=True)
    password = models.CharField(max_length=32, blank=True, null=True)
    status = models.CharField(  max_length=1, blank=True, null=True)
    nickname = models.CharField(db_column='nickName', max_length=20, blank=True, null=True)  # Field name made lowercase.
    role = models.CharField(max_length=8)
    gmt_create = models.DateTimeField(blank=True, null=True)
    gmt_modified = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tb_user'


class UserRole(models.Model):
    role = models.CharField(primary_key=True, max_length=8)
    name = models.CharField(max_length=10, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tb_user_role'
