/**
 * Created by lujiaju on 16/2/15.
 */

$(function(){
    $('.editorAction input').attr('readonly','readonly');
    $('.editorAction input').attr('disabled','disabled');
    $('.editorAction textarea').attr('readonly','readonly');
    $('.editorAction option').attr('disabled','disabled');
    var data = myStorage;
    var sendData = {};
    //变成json
    $.extend(true,sendData,data);
    sendData.csrfmiddlewaretoken=$("input[name=csrfmiddlewaretoken]").val();
    sendData.formContent = changeDataType(sendData.formContent);
    $('#dataTitle').val(sendData.title);
    $('#dataDescription').val(sendData.description);
    $('#dataContent').val(sendData.formContent);
    $('#dataLogic').val(sendData.logic);
    $('#dataLogicContent').val(sendData.logicContent);
    $('#gmtEnd').val(sendData.gmtEnd);
    $('#needAge').val(sendData.needAge);
    $('#needSex').val(sendData.needSex);
    $('#needOccupation').val(sendData.needOccupation);
    $('#age').val(sendData.age);
    $('#sex').val(sendData.sex);
    $('#occupations').val(sendData.occupations);
    //渲染标题
    $('#title').text(data.title);
    //渲染题目
    renderMyQuestions(data.formContent);
    renderStores(data.storeList);
    $('.storesList input').attr('readonly','readonly');
    $('.storesList input').attr('disabled','disabled');
    $('.storesList input').attr('checked','checked');
    //发送数据
    $('#store').on('click',function(e){
        var money,amount,storeName;
        money = $('#submitMoney').val();
        //amount = $('#submitAmount').val();
        //storeName = $('#storeName').val();
        var p_money;
        var p_amount = /^[1-9][0-9]*$/g;
        if(!money||isNaN(money)){
            $('.moneyError').removeClass('hidden');
            e.preventDefault();
            return;
        }
        if(Number(money)<0.01){
            $('.moneyError').removeClass('hidden');
            e.preventDefault();
            return;
        }
        var store_num = [];
        $('input[name="storeAmount"]').each(function(){
            var tmp = {};
            tmp.amount = $(this).val();
            tmp.pk = $(this).data('num');
            if(!tmp.amount||isNaN(tmp.amount)){
                $('.storeInputError').removeClass('hidden');
                e.preventDefault();
                return;
            }
            console.log(tmp.amount);
            console.log(tmp.pk);
            store_num.push(tmp);
        });
        $('#submitAmount').val(JSON.stringify(store_num));
        //e.preventDefault();
        //return;

        sendData.amount = $('#submitMoney').val();
        //sendData.num = $('#submitAmount').val();
        localStorage.removeItem('myData');
        //$.post('/questionnaire/form',sendData,function(result){
        //    //console.log('success');
        //});
    });

    $('#submitMoney').on('focus',function(){
        $('.moneyError').addClass('hidden');
    });
    //$('#submitAmount').on('focus',function(){
    //    $('.amountError').addClass('hidden');
    //});
    $('.storeName').on('focus',function(){
        $('.storeMsg2').addClass('hidden');
        $('.storeNameError').addClass('hidden');
    });
    $('.storeNum').on('focus',function(){
        $('.storeMsg').addClass('hidden');
        $('.storeNumError').addClass('hidden');
    });
    $('.storeName').on('blur',function(){
        $('.storeNameError').removeClass('hidden');
    });
    $('.storeNum').on('blur',function(){
        $('.storeNumError').removeClass('hidden');
    });
    function changeDataType(myData){
        if(!myData) return;
        var target,tmp,i,a;
        var len = myData.length;
        tmp='';
        tmp += '[';
        for(i=0;i<len;i++){
            if(i == len-1){
                tmp += pjzd(myData[i]);
            }else{
                tmp += pjzd(myData[i])+',';
            }
        }
        tmp += ']';
        return tmp;
    }
    function pjzd(obj){
        var str = '';
        var num = 0;
        var a, i,arr=[];
        for(a in obj){
            arr.push(a);
        }
        num = arr.length;
        var singleWords = '';
        str+='{'
        for(i=0;i<num;i++){
            if(i == num-1){
                str+='"'+arr[i]+'":"'+obj[arr[i]]+'"';
            }else{
                str+='"'+arr[i]+'":"'+obj[arr[i]]+'"'+',';
            }
        }
        str+='}';
        return str;
    }
    //渲染门店
    function renderStoreList(){
        var data = myStorage.storeList;
        //<div class="storeSingle">
        //<span>金钱豹淮海路店</span>
        //<input type="text" placeholder="请输入数量" name="storeAmount">
        //</div>
        var text = '';
        data.forEach(function(c,i,arr){
            text += '<div class="storeSingle">';
            text += '<span>';
            text += c.name;
            text += '</span>';
            text += '<input type="text" placeholder="请输入数量" name="storeAmount" data-num="';
            text += c.id;
            text += '">';
            text += '</div>';
        });
        $('#storeList').append(text);
        $('input[name="storeAmount"]').on('click',function(){
            $('.storeInputError').addClass('hidden');
        });
    }
    //console.log('::::::');
    //console.log(sendData);
    //把数据存储到localstorage里面
    localStorage['myData'] = JSON.stringify(myStorage);
    //返回第二步
    $('#backtosecond').on('click',function(){
        console.log('back')
        $.get('/questionnaire/ajaxStep2',function(data){
            //console.log(data);
          $('#step2_content').html(data);
        });
    })
    //增加门店
    $('#addStore').on('click',function(){
        $('.storeForms').append($('.myStore').eq(0).clone().removeClass('hidden'));
    });
    renderStoreList();
});
function getAllStore(){
    var len = $('input[name="storeName"]').length;
    var arr = [];
    var sum = 0;
    for(var i = 0;i<len;i++){
        var obj = {};
        obj.storeName = $('input[name="storeName"]').eq(i).val();
        obj.num = $('input[name="storeNum"]').eq(i).val();
        sum += Number($('input[name="storeNum"]').eq(i).val());
        arr.push(obj);
    }
    $('#formStore').val(JSON.stringify(arr));
    console.log(JSON.stringify(arr));
    return sum;
}
function renderMyQuestions(data){
    if(!data){return}
    var len = data.length;
    //console.log('题目长度'+len);
    for(var i=0;i<len;i++){
        //console.log('题目类型');
        //console.log(data[i].type);
        switch (data[i].type){
            case 'question1':
                $('.paperBody').append($('.action1').eq(0).clone().removeClass('hidden'));
                $('.editorAction').eq(7+i).find('label').text(data[i].title);
                $('.editorAction').eq(7+i).find('.singlyText-description p').text(data[i].description);
                break;
            case 'question2':
                $('.paperBody').append($('.action2').eq(0).clone().removeClass('hidden'));
                $('.editorAction').eq(7+i).find('label').text(data[i].title);
                $('.editorAction').eq(7+i).find('.singlyText-description p').text(data[i].description);
                break;
            case 'question3':
                $('.paperBody').append($('.action3').eq(0).clone().removeClass('hidden'));
                $('.editorAction').eq(7+i).find('label').text(data[i].title);
                $('.editorAction').eq(7+i).find('.singlyText-description p').text(data[i].description);
                break;
            case 'question4':
                console.log();
                $('.paperBody').append($('.action4').eq(0).clone().removeClass('hidden'));
                $('.editorAction').eq(7+i).find('label').text(data[i].title);
                $('.editorAction').eq(7+i).find('.singlyText-description p').text(data[i].description);
                for(var j = 0;j<3;j++){
                  $('.editorAction').eq(7+i).find('.myDrop>option').eq(j).text(data[i].option[j]);
                }
                break;
            case 'question5':
                $('.paperBody').append($('.action5').eq(0).clone().removeClass('hidden'));
                $('.editorAction').eq(7+i).find('label').text(data[i].title);
                $('.editorAction').eq(7+i).find('.singlyText-description p').text(data[i].description);
                for(var j = 0;j<3;j++){
                  $('.editorAction').eq(7+i).find('.checkItem>span').eq(j).text(data[i].option[j]);
                }
                break;
            case 'question6':
                $('.paperBody').append($('.action6').eq(0).clone().removeClass('hidden'));
                $('.editorAction').eq(7+i).find('label').text(data[i].title);
                $('.editorAction').eq(7+i).find('.singlyText-description p').text(data[i].description);
                for(var j = 0;j<3;j++){
                  $('.editorAction').eq(7+i).find('.checkItem>span').eq(j).text(data[i].option[j]);
                }
                break;
            case 'question7':
                $('.paperBody').append($('.action7').eq(0).clone().removeClass('hidden'));
                $('.editorAction').eq(7+i).find('label').text(data[i].title);
                $('.editorAction').eq(7+i).find('.singlyText-description p').text(data[i].description);
                break;
        }
    }
}

function renderStores(stores) {
    /*获得stores*/
    var git = stores;
    var tmp = '';
    git.forEach(function (c, i, arr) {
        tmp += '<li>';
        tmp += '<input type="checkbox"><span></span>';
        tmp += c.name;
        tmp += '</li>';
    });
    $('#storeGit').append(tmp);
}