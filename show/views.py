#!/usr/bin/env python
# encoding: utf-8
"""
    @author: Magic Joey
    @contact: outlierw@gmail.com
    @site: http://underestimated.me
    @project: mystery
    @description:
    @version: 2016-09-01 12:19,views V1.0
"""
from datetime import datetime
import json
from django.db import IntegrityError
from django.http import HttpResponseRedirect, Http404, HttpResponse
from django.shortcuts import render

# Create your views here.
from django.utils.datastructures import MultiValueDictKeyError
import re
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from show.models import AuthRole, User, AuthPrivilege, AuthMenu, AuthUserRole, AuthRolePrivilege, AuthMenuLevel, Sale, \
    Storage, Commodity, UserRole, SaleStatistics

_SESSION_USER = "user"


def index(request):
    return render(request, "show/index.html")


def input(request):
    return render(request, "show/input.html")


def output(request):
    return render(request, "show/output.html")


def process(request):
    return render(request, "show/process.html")


def progress(request):
    return render(request, "show/progress.html")


def query(request):
    return render(request, "show/query.html")


def recall(request):
    return render(request, "show/recall.html")


def supplier(request):
    return render(request, "show/supplier.html")


def storage(request):
    storageList = Storage.objects.all()
    return render(request, "show/storage.html", {"storageList": storageList})


def commodity(request):
    commodityList = Commodity.objects.all()
    return render(request, "show/commodity.html", {"commodityList": commodityList})


def sale(request):
    saleList = Sale.objects.all()
    return render(request, "show/sale.html", {"saleList": saleList})


def auth_list(request):
    privilegeList = AuthPrivilege.objects.all()
    return render(request, "show/auth/list.html", {"privilegeList": privilegeList})


def auth_menu(request):
    menuList = AuthMenu.objects.all()
    return render(request, "show/auth/menu.html", {"menuList": menuList})


@api_view(['GET', 'POST'])
def login(request):
    if request.method == "GET":
        return render(request, "show/login.html", {})
    elif request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        try:
            assert username is not None  # , "用户名不可为空"
            assert password is not None  # , "密码不可为空"
        except AssertionError as e:
            return __json_response("F", e)

        users = User.objects.filter(user_name=username)
        if users is not None and users.count() > 0:
            user = users[0]
            # if user.status != 'S':
            #     return Response(userLoginReq.data, status=status.HTTP_403_FORBIDDEN)
            if user.password != password:
                return __json_response("F", "用户名密码错误")
            __update_session_user(user, request)
            try:
                userRole = AuthUserRole.objects.get(user_id=user.id)
                userRoleSerial = {"role": userRole.role_id.role_id, "name": userRole.role_id.role_name}
                request.session["userRole"] = userRoleSerial
                menu = queryMenu(user.id)
                request.session['menu'] = menu
            except UserRole.DoesNotExist:
                pass
            return __json_response("S", "登陆成功")
        else:
            return __json_response("F", "用户名不存在")


def queryMenu(userId):
    sql = "select * from tb_auth_menu where menu_id in(select menu_id from tb_auth_privilege where privilege_id in (select privilege_id from tb_auth_role_privilege ap where ap.role_id in(select role_id from tb_auth_user_role ur where ur.user_id= %s ))) and type='MENU' order by weight"
    menuList = AuthMenu.objects.raw(sql, [userId])
    # menuList = AuthMenu.objects.filter(menu_level=1, type="MENU").order_by("weight")
    menuStr = ""
    is_first = True
    for menu in menuList:

        if menu.menu_level_id == 1 and not is_first:
            menuStr += "</ul></li>"
        if is_first:
            is_first = False
        menuStr += menu.content
        if menu.menu_level_id == 1:
            menuStr += "<ul>"
    return menuStr


def __update_session_user(user, request):
    userSerial = {"user_id": user.id, "userName": user.user_name, "status": user.status,
                  "nickname": user.nickname, "role": user.role, "introduction": user.introduction}
    request.session["user"] = userSerial


def profile(request):
    if request.method == "GET":
        user = __get_session_user(request)
        return render(request, "show/profile.html", {"user": user})
    elif request.method == "POST":
        user = __get_session_user(request)
        user.nickname = request.POST.get("nickname")
        user.introduction = request.POST.get("introduction")
        user.save()
        __update_session_user(user, request)
        return HttpResponseRedirect("/profile/")


def password(request):
    if request.method == "GET":
        return render(request, "show/password.html")
    elif request.method == "POST":
        user = __get_session_user(request)
        old_password = request.POST.get("old_password")
        new_password = request.POST.get("new_password")
        if user.password != old_password:
            return HttpResponseRedirect("/password/?msg=旧密码不正确")
        if new_password is None or len(new_password) < 6:
            return HttpResponseRedirect("/password/?msg=密码为空或小于6位")
        user.password = new_password
        user.save()
        return HttpResponseRedirect("/logout/")


def sale_statistics(request):
    if request.method == "GET":
        return render(request, "show/sale_statistics.html")
    elif request.method == "POST":
        pass


def ajax_sale_statistics(request):
    from_date = request.GET.get("from_date")
    to_date = request.GET.get("to_date")
    if from_date is None or from_date == '':
        from_date = '2016-01-01'
    if to_date is None or to_date == '':
        to_date = '2020-12-31'
    sql = "select max(id) id,sale_date,saler_name,count(1) cnt,sum(price) price from tb_sale where sale_date>=%s and sale_date<=%s group by sale_date,saler_name order by saler_name,sale_date"
    ssList = SaleStatistics.objects.raw(sql,[from_date, to_date])
    total_sql = "select max(id) id,sale_date,count(*) cnt,sum(price) price from tb_sale where sale_date>=%s and sale_date<=%s group by sale_date order by sale_date"
    totalSsList = SaleStatistics.objects.raw(total_sql,[from_date, to_date])
    return_json = {}
    date_list = []
    total_data = []
    for total in totalSsList:
        total_data.append(total.price)
        date_list.append(total.sale_date)
    # return_json['total'] = total_data
    return_json['date'] = date_list

    single_data = []
    return_json['data'] = []
    return_json['data'].append({"name":"合计", "data": total_data})

    saler_json = {}
    for sale in ssList:

        if saler_json.get(sale.saler_name) is None:
            saler_json[sale.saler_name] = []
        saler_json[sale.saler_name].append(sale)

    for (k, s_s_json) in saler_json.items():
        single_json = []
        index = 0
        for i in range(0, len(date_list)):
            if s_s_json[index].sale_date == date_list[i]:
                single_json.append(s_s_json[index].price)
                index += 1
            else:
                single_json.append(0)
        return_json['data'].append({"name": k, "data": single_json})
    return HttpResponse(json.dumps(return_json), status.HTTP_200_OK)


def auth_mine(request):
    sessionUser = request.session[_SESSION_USER]
    user = User.objects.get(id=sessionUser['user_id'])
    roleList = AuthUserRole.objects.filter(user_id=user.id)
    if user.role == "ADMIN":
        privilegeList = AuthPrivilege.objects.all().order_by("privilege_id")
    else:
        sql = "select * from tb_auth_privilege where privilege_id in (select privilege_id from tb_auth_role_privilege ap where ap.role_id in(select role_id from tb_auth_user_role ur where ur.user_id= %s))"
        privilegeList = AuthPrivilege.objects.raw(sql, [user.id])
    return render(request, "show/auth/mine.html", {"privilegeList": privilegeList, "roleList": roleList})


def auth_role(request):
    roleList = AuthRole.objects.all()
    return render(request, "show/auth/role.html", {"roleList": roleList})


def auth_user(request):
    sessionUser = request.session["user"]

    user = User.objects.get(id=sessionUser['user_id'])
    userList = User.objects.all()
    # list(User.objects.filter(belongingId=user.id, is_employee="Y"))
    # userList.append(user)
    return render(request, "show/auth/user.html", {"userList": userList})


def auth_ajaxAdd(request):
    if request.method == "GET":
        privilege = None
        menuList = AuthMenu.objects.all()
        try:
            id = request.GET['id']
            if None != id:
                privilege = AuthPrivilege.objects.get(privilege_id=id)
                return render(request, "show/ajax/addPrivilege.html",
                              {"privilege": privilege, "mode": "edit", "menuList": menuList})
        except MultiValueDictKeyError:
            pass
        return render(request, "show/ajax/addPrivilege.html", {"menuList": menuList})
    elif request.method == "POST":
        privilege_title = request.POST.get('privilege_title')
        menu_id = request.POST.get('menu_id')
        action = request.POST.get('action')
        mode = request.POST.get('mode')
        privilege_id = request.POST.get('privilege_id')
        if "edit" == mode and privilege_id is not None:
            privilege = AuthPrivilege(privilege_id=privilege_id, action=action, menu_id=menu_id,
                                      privilege_title=privilege_title)
        else:
            privilege = AuthPrivilege(action=action, menu_id=menu_id, privilege_title=privilege_title)
        privilege.save()
        # return HttpResponse({"code":"S","msg":"保存成功"})
        return HttpResponseRedirect("/show/auth_list")


def auth_ajaxAddMenu(request):
    if request.method == "GET":
        menu = None
        menuLeveList = AuthMenuLevel.objects.all().order_by("leve_id")
        zeroLevel = AuthMenuLevel.objects.all().get(leve_id=1)
        parentMenuList = AuthMenu.objects.filter(menu_level=zeroLevel)
        try:
            id = request.GET['id']
            if None != id:
                menu = AuthMenu.objects.get(menu_id=id)
                return render(request, "show/ajax/addMenu.html",
                              {"menu": menu, "mode": "edit", "menuLeveList": menuLeveList,
                               "parentMenuList": parentMenuList})
        except MultiValueDictKeyError:
            pass
        return render(request, "show/ajax/addMenu.html",
                      {"menuLeveList": menuLeveList, "parentMenuList": parentMenuList})
    elif request.method == "POST":
        menu_level = request.POST.get('menu_level')
        menu_id = request.POST.get('menu_id')
        menu_title = request.POST.get('menu_title')
        menu_url = request.POST.get('menu_url')
        parent_id = request.POST.get('parent_id')
        type = request.POST.get("type")
        content = request.POST.get("content")
        weight = request.POST.get("weight")
        try:
            menuLevel = AuthMenuLevel.objects.get(leve_id=menu_level)
        except AuthMenuLevel.DoesNotExist:
            pass
        mode = request.POST.get('mode')
        if "edit" == mode and menu_id is not None:
            authMenu = AuthMenu(menu_id=menu_id, menu_level=menuLevel, menu_title=menu_title,
                                menu_url=menu_url, parent_id=parent_id, type=type, content=content, weight=weight)
        else:
            authMenu = AuthMenu(menu_level=menuLevel, menu_title=menu_title,
                                menu_url=menu_url, parent_id=parent_id, type=type, content=content, weight=weight)
        authMenu.save()
        # return HttpResponse({"code":"S","msg":"保存成功"})
        return HttpResponseRedirect("/show/auth_menu")


def auth_ajaxDelMenu(request):
    id = request.GET.get("id")
    authMenu = AuthMenu.objects.get(menu_id=id)
    authMenu.delete()
    return HttpResponseRedirect("/show/auth_menu")


def auth_ajaxAddRole(request):
    if request.method == "GET":
        try:
            id = request.GET['id']
            if None != id:
                role = AuthRole.objects.get(role_id=id)
                return render(request, "show/ajax/addRole.html", {"role": role, "mode": "edit"})
        except MultiValueDictKeyError:
            pass
        return render(request, "show/ajax/addRole.html")
    elif request.method == "POST":
        role_id = request.POST.get('role_id')
        role_name = request.POST.get('role_name')
        role_shortname = request.POST.get('role_shortname')
        mode = request.POST.get('mode')
        if "edit" == mode and role_id is not None:
            role = AuthRole(role_id=role_id, role_name=role_name, role_shortname=role_shortname)
        else:
            role = AuthRole(role_name=role_name, role_shortname=role_shortname)
        role.save()
        return HttpResponseRedirect("/auth_role/")


def auth_ajaxDelRole(request):
    id = request.GET.get("id")
    authRole = AuthRole.objects.get(role_id=id)
    authRole.delete()
    return HttpResponseRedirect("/auth_role/")


def auth_ajaxAllotRolePrivilege(request):
    if request.method == "GET":
        id = request.GET['id']
        if None != id:
            role = AuthRole.objects.get(role_id=id)
            rolePrivilegeList = AuthRolePrivilege.objects.filter(role_id=id)
            privilegeList = AuthPrivilege.objects.all().order_by("privilege_id")
            return render(request, "show/ajax/allotRolePrivilege.html",
                          {"role": role, "rolePrivilegeList": rolePrivilegeList, "privilegeList": privilegeList})
        else:
            raise Http404("请求错误")
    elif request.method == "POST":
        role_id = request.POST.get('role_id')
        privilegeIds = request.POST.getlist('privileges')
        roleList = AuthRolePrivilege.objects.filter(role_id=role_id)
        roleList.delete()
        if privilegeIds is not None:
            authRoleList = []
            for privilegeId in privilegeIds:
                try:
                    privilege = AuthPrivilege.objects.get(privilege_id=privilegeId)
                except AuthPrivilege.DoesNotExist:
                    continue
                authRole = AuthRolePrivilege(role_id=role_id, privilege_id=privilegeId)
                authRoleList.append(authRole)
            AuthRolePrivilege.objects.bulk_create(authRoleList)
        return HttpResponseRedirect("/auth_role/")


@api_view(['GET', 'POST'])
def auth_ajaxAddUser(request):
    if request.method == "GET":
        try:
            id = request.GET.get('id')
            if None != id:
                user = User.objects.get(id=id)
                return render(request, "show/ajax/addUser.html", {"user": user, "mode": "edit"})
        except User.DoesNotExist:
            pass
        except MultiValueDictKeyError:
            pass
        return render(request, "show/ajax/addUser.html")
    elif request.method == "POST":
        currentUser = __get_session_user(request)
        id = request.POST.get('id')
        nickname = request.POST.get('nickname')
        password = request.POST.get("password")
        username = request.POST.get("username")
        try:
            mode = request.POST.get('mode')
            userStatus = "N"
            assert username is not None, "用户名不可为空"
            assert password is not None and 6 <= len(password) < 32, "密码不符合要求"
            if "edit" == mode and id is not None:
                user = User.objects.get(id=id)
                assert user is not None, "用户不可为空"
                user.user_name = username
                user.password = password
                user.nickname = nickname
                user.gmt_modified = datetime.now()
            else:
                assert len(username)>=2, "用户名不符合要求"
                user = User(user_name=username, nickname=nickname, password=password,
                            gmt_create=datetime.now(), gmt_modified=datetime.now())
            user.save()
        except IntegrityError:
            # return HttpResponse({"status": "F", "msg": "手机号已存在"}, Status.200)
            return Response({"status": "F", "msg": "户名已存在"})
        except AssertionError as e:
            return Response({"status": "F", "msg": e})
        return HttpResponseRedirect("/auth_user/")
        # return Response({"userId": user.id, "status": "S"})


def auth_ajaxAllotUserRole(request):
    if request.method == "GET":
        id = request.GET['id']
        if None != id:
            user = User.objects.get(id=id)
            userRoleList = AuthUserRole.objects.filter(user_id=id)
            roleList = AuthRole.objects.all().order_by("role_id")
            return render(request, "show/ajax/allotUserRole.html",
                          {"user": user, "userRoleList": userRoleList, "roleList": roleList})
        else:
            raise Http404("请求错误")
    elif request.method == "POST":
        user_id = request.POST.get('user_id')
        roleIds = request.POST.getlist('roles')
        roleList = AuthUserRole.objects.filter(user_id=user_id)
        roleList.delete()
        if roleIds is not None:
            userRoleList = []
            for roleId in roleIds:
                try:
                    role = AuthRole.objects.get(role_id=roleId)
                except AuthPrivilege.DoesNotExist:
                    continue
                userRole = AuthUserRole(user_id=user_id, role_id=role)
                userRoleList.append(userRole)
            AuthUserRole.objects.bulk_create(userRoleList)
        return HttpResponseRedirect("/auth_user/")


def ajax_add_storage(request):
    if request.method == "GET":
        try:
            id = request.GET['id']
            if None != id:
                storage = Storage.objects.get(id=id)
                return render(request, "show/ajax/add_storage.html", {"storage": storage, "mode": "edit"})
        except User.DoesNotExist:
            pass
        except MultiValueDictKeyError:
            pass
        return render(request, "show/ajax/add_storage.html")
    elif request.method == "POST":
        mode = request.POST.get("mode")
        global storage
        if mode == "edit":
            storage = Storage.objects.get(id=request.POST.get("storage_id"))
        else:
            storage = Storage()
        storage.commodity_no = request.POST.get("commodity_no")
        storage.commodity_batch = request.POST.get("commodity_batch")
        storage.commodity_name = request.POST.get("commodity_name")
        storage.gmt_create = request.POST.get("gmt_create")
        storage.supplier_relation = request.POST.get("supplier_relation")
        storage.direction = request.POST.get("direction")
        storage.storage = request.POST.get("storage")
        storage.max_times = request.POST.get("max_times")
        storage.price = request.POST.get("price")
        storage.num = request.POST.get("num")
        storage.memo = request.POST.get("memo")
        storage.unit = request.POST.get("unit")
        storage.save()
        return HttpResponseRedirect("/storage/")


def ajax_add_commodity(request):
    if request.method == "GET":
        try:
            id = request.GET['id']
            if None != id:
                commodity = Commodity.objects.get(id=id)
                return render(request, "show/ajax/add_commodity.html", {"commodity": commodity, "mode": "edit"})
        except User.DoesNotExist:
            pass
        except MultiValueDictKeyError:
            pass
        return render(request, "show/ajax/add_commodity.html")
    elif request.method == "POST":
        mode = request.POST.get("mode")
        global commodity
        if mode == "edit":
            commodity = Commodity.objects.get(id=request.POST.get("commodity_id"))
        else:
            commodity = Commodity()
        commodity.commodity_no = request.POST.get("commodity_no")
        commodity.commodity_name = request.POST.get("commodity_name")
        commodity.gmt_create = request.POST.get("gmt_create")
        commodity.document_no = request.POST.get("document_no")
        commodity.supplier_company = request.POST.get("supplier_company")
        commodity.supplier_ab = request.POST.get("supplier_ab")
        commodity.department = request.POST.get("department")
        commodity.storehouse_name = request.POST.get("storehouse_name")
        commodity.applier_name = request.POST.get("applier_name")
        commodity.auditor_name = request.POST.get("auditor_name")
        commodity.applier_id = request.POST.get("applier_id")
        commodity.auditor_id = request.POST.get("auditor_id")
        commodity.memo = request.POST.get("memo")
        commodity.stock_num = request.POST.get("stock_num")
        commodity.save()
        return HttpResponseRedirect("/commodity/")


def ajax_add_sale(request):
    if request.method == "GET":
        try:
            id = request.GET['id']
            if None != id:
                sale = Sale.objects.get(id=id)
                return render(request, "show/ajax/add_sale.html", {"sale": sale, "mode": "edit"})
        except User.DoesNotExist:
            pass
        except MultiValueDictKeyError:
            pass
        return render(request, "show/ajax/add_sale.html")
    elif request.method == "POST":
        mode = request.POST.get("mode")
        global commodity
        if mode == "edit":
            sale = Sale.objects.get(id=request.POST.get("sale_id"))
        else:
            sale = Sale()
        sale.commodity_no = request.POST.get("commodity_no")
        sale.commodity_batch = request.POST.get("commodity_batch")
        sale.sale_date = request.POST.get("sale_date")
        sale.saler_id = request.POST.get("saler_id")
        sale.saler_name = request.POST.get("saler_name")
        sale.storage_id = request.POST.get("storage_id")
        sale.price = request.POST.get("price")
        sale.num = request.POST.get("num")
        sale.unit_relation = request.POST.get("unit_relation")
        sale.unit = request.POST.get("unit")
        sale.memo = request.POST.get("memo")
        sale.save()
        return HttpResponseRedirect("/sale/")


def logout(request):
    try:
        # 不存在时会报错
        del request.session["user"]
    except KeyError:
        pass
    return HttpResponseRedirect('/login/')


def __json_response(code, msg):
    return HttpResponse(json.dumps({"code": code, "msg": msg}), status.HTTP_200_OK)


def __get_session_user(request):
    return User.objects.get(id=request.session['user']['user_id'])
