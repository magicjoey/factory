/**
 * Created by lujiaju on 16/1/31.
 */
//var _sessionData = localStorage.myData;
if(myStorage){
    //var tmp = JSON.parse(_sessionData);
    $('#question_title').text(myStorage.title);
    //myStorage = JSON.parse(_sessionData);
    renderMyQuestions(myStorage.formContent);
    addEditorAction();
    if(myStorage.logicContent){
        renderLogic(myStorage.logicContent);
      }

}
//renderMyQuestions(data.formContent);

function renderStores(){
  //<div class="store">
  //<input type="checkbox" name="storeItem" value="1">
  //<span>金钱豹淮海路店</span>
  //</div>
  //$('#storeList').append();
  /*获得stores*/
  var git = [];
  //var stores = [];
  $.get('/questionnaire/ajaxStores',function(data){
    git = data;
    git  = [{"pk": 1, "fields": {"city": 2801, "area": 2853,
      "detail_address": "\u5317\u4eac\u897f\u57ce\u533a\u4e8c\u73af\u5230\u4e09\u73affaskdfjkasj77",
      "address": "faskdfjkasj77", "companyId": 61, "operator": 61, "name": "1fksjdfk",
      "gmtCreate": "2016-05-08T04:33:57Z", "gmtUpdate": "2016-05-08T05:24:04Z", "province": 1},
      "model": "questionnaire.store"}]
    var tmp = '';
    git.forEach(function(c,i,arr){
      tmp += '<div class="store">';
      tmp += '<input type="checkbox" name="storeItem" value="';
      tmp += c.pk;
      tmp += '">';
      tmp += '<span>';
      tmp += c.fields.name;
      tmp += '</span> </div>';
      //stores.push({id: c.pk,name: c.fields.name});
    });
    $('#storeList').empty();
    $('#storeList').append(tmp);
    $('.store').on('click','input[name="storeItem"]:checked',function(){
      console.log('storeItem clicking');
    });
  });
  $('#storeConfirm').on('click',function(){
    var selectedStores = [];
    $('input[name="storeItem"]:checked').each(function(){
      var tmp = {};
      tmp.id = $(this).val();
      tmp.name = $(this).next().text();
      selectedStores.push(tmp);
    });
    console.log(selectedStores);
    myStorage.storeList = selectedStores;
  });
}

$(function(){
  $(".form_datetime").on('click',function(){
    myStorage.gmtEnd = $(this).val();
  });
  $('input[name="condition"]').on('click',function(){
    var needCondition = $('input[name="condition"]:checked').val();
    if(needCondition == 'needAge'){
      myStorage.needAge = 'ON';
      myStorage.needSex = 'OFF';
      myStorage.needOccupation = 'OFF';
    }
    if(needCondition == 'needSex'){
      myStorage.needAge = 'OFF';
      myStorage.needSex = 'ON';
      myStorage.needOccupation = 'ON';
    }
    if(needCondition == 'needOccupation'){
      myStorage.needAge = 'OFF';
      myStorage.needSex = 'OFF';
      myStorage.needOccupation = 'ON';
    }
  });
  $('#mainSelect').on('click',function(){
    if(myStorage.needAge == 'ON'){
      myStorage.age = $('#mainSelect').val();
    }
    if(myStorage.needSex == 'ON'){
      myStorage.sex = $('#mainSelect').val();
    }
    if(myStorage.needOccupation == 'ON'){
      myStorage.occupations = $('#mainSelect').val();
    }
  });
  var questionsIndex = 0;
  //绑定编辑操作
  $('.editor1').on('click',function(){
    //console.log('menu1');
    var flag = $(this).hasClass('editorActive');
    if(!flag){
      $(this).siblings('li').removeClass('editorActive');
      $(this).addClass('editorActive');
      $('#operation1').siblings('div').addClass('hidden');
      $('#operation1').removeClass('hidden');
    }
  });
  $('.editor2').on('click',function(){
    //console.log('menu2');
    var flag = $(this).hasClass('editorActive');
    if(!flag){
      $(this).siblings('li').removeClass('editorActive');
      $(this).addClass('editorActive');
      $('#operation2').siblings('div').addClass('hidden');
      $('#operation2').removeClass('hidden');
    }
  });
  $('.editor3').on('click',function(){
    //console.log('menu3');
    var flag = $(this).hasClass('editorActive');
    if(!flag){
      $(this).siblings('li').removeClass('editorActive');
      $(this).addClass('editorActive');
      $('#operation3').siblings('div').addClass('hidden');
      $('#operation3').removeClass('hidden');
    }
  });
  $('.editor4').on('click',function(){
    //console.log('menu3');
    var flag = $(this).hasClass('editorActive');
    if(!flag){
      $(this).siblings('li').removeClass('editorActive');
      $(this).addClass('editorActive');
      $('#operation4').siblings('div').addClass('hidden');
      $('#operation4').removeClass('hidden');
    }
  });
  $('.editor5').on('click',function(){
    //console.log('menu3');
    var flag = $(this).hasClass('editorActive');
    if(!flag){
      $(this).siblings('li').removeClass('editorActive');
      $(this).addClass('editorActive');
      $('#operation5').siblings('div').addClass('hidden');
      $('#operation5').removeClass('hidden');
      if(myStorage.logicContent){
        renderLogic(myStorage.logicContent);
      }
    }
  });
  /*保存数据*/
  $('#q_title').on('blur',function(){
    var value = $(this).val();
    myStorage.title = value;
    //console.log(myStorage.title);
    $('#question_title').text(myStorage.title);
  });
  $('#q_description').on('blur',function(){
    var value = $(this).val();
    myStorage.description = value;
    //console.log(myStorage.description);
  });
  /*input radio选中事件*/
  $('.conditionLeft input').on('click',function(){
    var v = $('input[name=condition]:checked').attr('value');
    renderSelects(v)
  });
  $('#logicQuestionA').focus(function(){
    var self = $(this);
    showLogicList(self);
  });
  $('#logicQuestionB').focus(function(){
    var self = $(this);
    showLogicList(self);
  });

  //给问题A加载选项内容
  $('#logicQuestionAnswerDrop1').focus(function(){
    var self = $(this);
    var num = $('#logicQuestionA').val();
    showLogicQuestionItems(self,num);
  });
  //给问题B加载选项内容
  $('#logicQuestionAnswerDrop2').focus(function(){
    var self = $(this);
    var num = $('#logicQuestionB').val();
    showLogicQuestionItems(self,num);
  });
  //逻辑提交表
  $('#logicSubmit').on('click',function(){
    myStorage.logic = 'Y';
    var a = $('#logicQuestionA').val();
    var b = $('#logicQuestionB').val();
    var tmp = $('#logicQuestionA').val()+$('#logicQuestionB').val()+$('#logicQuestionAnswerDrop1').val()+$('#logicQuestionDefaultDrop').val()+$('#logicQuestionAnswerDrop2').val();
    //console.log(tmp);
    if(tmp.length!=5){
      $('#logicError').removeClass('hidden');
      return;
    }
    if(a==b){
      $('#logicError').removeClass('hidden');
      return;
    }
    if(!$('.editorAction').eq(parseInt(a)+7).hasClass('action5')){
      $('#logicError').removeClass('hidden');
      return;
    }
    if(!$('.editorAction').eq(parseInt(b)+7).hasClass('action5')){
      $('#logicError').removeClass('hidden');
      return;
    }
    if(!myStorage.logicContent){
      myStorage.logicContent=tmp;
      $('.logicInput').empty();
      $('#logicSuccess').removeClass('hidden');
    }else{
      if(myStorage.logicContent.indexOf(tmp)!=-1) {
        $('#logicError').removeClass('hidden');
        return;
      }
      myStorage.logicContent+='&'+tmp;
      $('#logicSuccess').removeClass('hidden');
      $('.logicInput').empty();
    }

  });
  //隐藏错误
  $('.logicInput').focus(function(){
    $('#logicError').addClass('hidden');
    $('#logicSuccess').addClass('hidden');
  })
  //渲染select组件
  function renderSelects(value){
    $('#mainSelect').empty();
    switch (value){
      case 'age':
            renderAge();
            break;
      case 'gender':
            renderGender();
            break;
      case 'work':
            renderWork();
            break;
      case 'takeIn':
            renderTakeIn();
            break;
      default:
            renderAge();
    }
  }
  //<option value="">123</option>
  function renderAge(){
    var dom = $('<option></option>');
    var dom1 = $('<option value="18">18岁以上</option>');
    var dom2 = $('<option value="30">30岁以上</option>');
    $('#mainSelect').append(dom);
    $('#mainSelect').append(dom1);
    $('#mainSelect').append(dom2);
  }
  function renderGender(){
    var dom = $('<option></option>');
    var dom1 = $('<option value="male">男</option>');
    var dom2 = $('<option value="female">女</option>');
    $('#mainSelect').append(dom);
    $('#mainSelect').append(dom1);
    $('#mainSelect').append(dom2);
  }
  function renderWork(){
    var dom = $('<option></option>');
    var dom1 = $('<option value="work1">程序员</option>')
    var dom2 = $('<option value="work2">产品经理</option>')
    var dom3 = $('<option value="work2">设计师</option>')
    var dom4 = $('<option value="work2">运维测试</option>')
    $('#mainSelect').append(dom)
    $('#mainSelect').append(dom1)
    $('#mainSelect').append(dom2)
    $('#mainSelect').append(dom3)
    $('#mainSelect').append(dom4)
  }
  function  renderTakeIn(){
    var dom = $('<option></option>');
    var dom1 = $('<option value="work1">10k以下</option>')
    var dom2 = $('<option value="work2">10~15k</option>')
    var dom3 = $('<option value="work2">15~25k</option>')
    var dom4 = $('<option value="work2">25k以上~</option>')
    $('#mainSelect').append(dom)
    $('#mainSelect').append(dom1)
    $('#mainSelect').append(dom2)
    $('#mainSelect').append(dom3)
    $('#mainSelect').append(dom4)
  }
  //select选中事件
  $('#mainSelect').change(function(){
    var t = $('#mainSelect').children('option:selected').val();
    //console.log(t);
  });
  //添加组建(start)

  //rmBtn 当移到当前元素的时候显示X号
  $('.questionSingle').hover(function(){
    $(this).find('.rmBtn').removeClass('hidden');
  },function(){
    $(this).find('.rmBtn').addClass('hidden');
  })


  $('.rmBtn').on('click',function(){
    $(this).parent().remove();
  });

  //单行文本
  $('#action1').on('click',function(){
    cloneDom1();
    createData(1);
  });
  //数字
  $('#action2').on('click',function(){
    cloneDom2();
    createData(2);
  });
  $('#action3').on('click',function(){
    cloneDom3();
    createData(3);
  });
  $('#action4').on('click',function(){
    cloneDom4();
    createData(4);
  });
  $('#action5').on('click',function(){
    cloneDom5();
    createData(5);
  });
  $('#action6').on('click',function(){
    cloneDom6();
    createData(6);
  });
  $('#action7').on('click',function(){
    cloneDom7();
    createData(7);
  });
  //克隆单行文本
  function cloneDom1(){
    $('.paperBody').append($('.action1').eq(0).clone().removeClass('hidden'));
    hoverAndRemove();
    addEditorAction();
    changeActiveDom();
    changeActiveValue(1);
    console.log('in clone')
  }
  function cloneDom2(){
    $('.paperBody').append($('.action2').eq(0).clone().removeClass('hidden'));
    hoverAndRemove();
    addEditorAction();
    changeActiveDom();
    changeActiveValue(2);
  }
  function cloneDom3(){
    $('.paperBody').append($('.action3').eq(0).clone().removeClass('hidden'));
    hoverAndRemove();
    addEditorAction();
    changeActiveDom();
    changeActiveValue(3);
  }
  function cloneDom4(){
    $('.paperBody').append($('.action4').eq(0).clone().removeClass('hidden'));
    hoverAndRemove();
    addEditorAction();
    changeActiveDom();
    changeActiveValue(4);
  }
  function cloneDom5(){
    $('.paperBody').append($('.action5').eq(0).clone().removeClass('hidden'));
    hoverAndRemove2();
    addEditorAction();
    changeActiveDom();
    changeActiveValue(5);
  }
  function cloneDom6(){
    $('.paperBody').append($('.action6').eq(0).clone().removeClass('hidden'));
    hoverAndRemove2();
    addEditorAction();
    changeActiveDom();
    changeActiveValue(6);
  }
  function cloneDom7(){
    $('.paperBody').append($('.action7').eq(0).clone().removeClass('hidden'));
    hoverAndRemove2();
    addEditorAction();
    changeActiveDom();
    changeActiveValue(7);
  }
  function cloneDom7Child(){
    $('.operationSettings').append($('.action7Child').eq(0).clone().removeClass('hidden'));
  }
  function hoverAndRemove(){
    //组建类型为singlyText
    $('.singlyText').hover(function(){
      $(this).find('.rmBtn').removeClass('hidden');
    },function(){
      $(this).find('.rmBtn').addClass('hidden');
    });

    $('.rmBtn').on('click',function(){
      $(this).parent().remove();
    });
  }
  function hoverAndRemove2(){
    //组建类型为questionSingle
    $('.questionSingle').hover(function(){
      $(this).find('.rmBtn').removeClass('hidden');
    },function(){
      $(this).find('.rmBtn').addClass('hidden');
    });

    $('.rmBtn').on('click',function(){
      $(this).parent().remove();
    });
  }

  /*实时编辑*/
  function changeActiveDom(){
    //console.log('test');
    //确认实时编辑的是哪个dom
    $('.editorAction').unbind('click',findActive);
    $('.editorAction').on('click',findActive);
    function findActive(){
      $(this).addClass('editing').siblings('.editorAction').removeClass('editing');
      //console.log('editing');
    }
  }
  function createData(num){
    var normalQ = {
      title:'题目'+questionsIndex,
      description:''
    };
    var unordinaryQ = {
      title:'题目'+questionsIndex,
      description:'',
      option:['选项1','选项2','选项3']
    }
    questionsIndex++;
    switch (num){
      case 1:
            normalQ.type = 'question1';
            myStorage.formContent.push(normalQ);
            break;
      case 2:
            normalQ.type = 'question2';
            myStorage.formContent.push(normalQ);
            break;
      case 3:
            normalQ.type = 'question3';
            myStorage.formContent.push(normalQ);
            break;
      case 4:
            unordinaryQ.type = 'question4';
            myStorage.formContent.push(unordinaryQ);
            break;
      case 5:
            unordinaryQ.type = 'question5';
            myStorage.formContent.push(unordinaryQ);
            break;
      case 6:
            unordinaryQ.type = 'question6';
            myStorage.formContent.push(unordinaryQ);
            break;
      case 7:
            normalQ.type = 'question7';
            myStorage.formContent.push(normalQ);
            break;
      default:
            myStorage.formContent.push(normalQ);
            break;
    }
    //console.log('create ending');
    //console.log(myStorage);
  }
  function changeActiveValue(num){
    var title,description,single={};
    //editorType1,2,3,4,5,6,7
    var fun1 = function(){
      $('.editorType1').on('mouseover',function(){
      })
      $('.editorType1 input').on('blur',function(){
        title = $(this).val();
        single.title = title;
        var index = findActiveDom();
        $('.editorAction').eq(index).find('label').text(single.title);
        myStorage.formContent[index-7].title=single.title;

      });
      $('.editorType1 textarea').on('blur',function(){
        description = $(this).val();
        single.description = description;
        var index = findActiveDom();
        $('.editorAction').eq(index).find('.singlyText-description p').text(single.description);
        myStorage.formContent[index-7].description=single.description;
      });
      $('.editorBody').on('blur',function(){
        //console.log('lose current blur');
      });
    }
    var fun2 = function(){
      $('.editorType2 input').on('blur',function(){
        title = $(this).val();
        single.title = title;
        var index = findActiveDom();
        $('.editorAction').eq(index).find('label').text(single.title);
        myStorage.formContent[index-7].title=single.title;
      });
      $('.editorType2 textarea').on('blur',function(){
        description = $(this).val();
        single.description = description;
        var index = findActiveDom();
        $('.editorAction').eq(index).find('.singlyText-description p').text(single.description);
        myStorage.formContent[index-7].description=single.description;
        //console.log(myStorage);
      });
    }
    var fun3 = function(){
      $('.editorType3 input').on('blur',function(){
        title = $(this).val();
        single.title = title;
        var index = findActiveDom();
        $('.editorAction').eq(index).find('label').text(single.title);
        myStorage.formContent[index-7].title=single.title;
      });
      $('.editorType3 textarea').on('blur',function(){
        description = $(this).val();
        single.description = description;
        var index = findActiveDom();
        $('.editorAction').eq(index).find('.singlyText-description p').text(single.description);
        myStorage.formContent[index-7].description=single.description;
        //console.log(myStorage);
      });
    }
    var fun4 = function(){
      $('.editorType4>input').on('blur',function(){
        title = $(this).val();
        single.title = title;
        var index = findActiveDom();
        $('.editorAction').eq(index).find('label').text(single.title);
        myStorage.formContent[index-7].title=single.title;
      });
      $('.editorType4 textarea').on('blur',function(){
        description = $(this).val();
        single.description = description;
        var index = findActiveDom();
        $('.editorAction').eq(index).find('.singlyText-description p').text(single.description);
        myStorage.formContent[index-7].description=single.description;
      });
      var len = $('.editorType4 .operation').length;
      $('.editorType4 .operation>input').on('blur',function(){
        var tmp='',option4=[];
        for(var i = 0 ;i<len;i++){
          tmp = $('.editorType4 .operation').eq(i).find('input').val();
          option4.push(tmp);
        }
        single.option = option4;
        var index = findActiveDom();
        for(var j = 0;j<len;j++){
          $('.editorAction').eq(index).find('.myDrop>option').eq(j).text(option4[j]);
          $('.editorAction').eq(index).find('.myDrop>option').eq(j).val(option4[j]);
        }
        myStorage.formContent[index-7].option=single.option;
        //console.log(myStorage);
      });
    }
    var fun5 = function(){
      $('.editorType5>input').on('blur',function(){
        title = $(this).val();
        single.title = title;
        var index = findActiveDom();
        $('.editorAction').eq(index).find('label').text(single.title);
        myStorage.formContent[index-7].title=single.title;
      });
      $('.editorType5 textarea').on('blur',function(){
        description = $(this).val();
        single.description = description;
        var index = findActiveDom();
        $('.editorAction').eq(index).find('.singlyText-description p').text(single.description);
        myStorage.formContent[index-7].description=single.description;
      });
      var len = $('.editorType5 .operation').length;
      $('.editorType5 .operation>input').on('blur',function(){
        //console.log('in 5');
        var tmp='',option5=[];
        for(var i = 0 ;i<len;i++){
          tmp = $('.editorType5 .operation').eq(i).find('input').val();
          option5.push(tmp);
          //console.log(tmp);
        }
        single.option = option5;
        var index = findActiveDom();
        for(var j = 0;j<len;j++){
          if(option5[j]){
            $('.editorAction').eq(index).find('.checkItem>span').eq(j).text(option5[j]);
            $('.editorAction').eq(index).find('.checkItem>span').eq(j).val(option5[j]);
          }
        }
        myStorage.formContent[index-7].option=single.option;
        //console.log(myStorage);
      });
    }
    var fun6 = function(){
      $('.editorType6 input').on('blur',function(){
        title = $(this).val();
        single.title = title;
        var index = findActiveDom();
        $('.editorAction').eq(index).find('label').text(single.title);
        myStorage.formContent[index-7].title=single.title;
      });
      $('.editorType6 textarea').on('blur',function(){
        description = $(this).val();
        single.description = description;
        var index = findActiveDom();
        $('.editorAction').eq(index).find('.singlyText-description p').text(single.description);
        myStorage.formContent[index-7].description=single.description;
      });
      var len = $('.editorType6 .operation').length;
      $('.editorType6 .operation>input').on('blur',function(){
        var tmp='',option6=[];
        for(var i = 0 ;i<len;i++){
          tmp = $('.editorType6 .operation').eq(i).find('input').val();
          option6.push(tmp);
          //console.log(tmp);
        }
        single.option = option6;
        var index = findActiveDom();
        for(var j = 0;j<len;j++){
          if(option6[j]){
            $('.editorAction').eq(index).find('.checkItem>span').eq(j).text(option6[j]);
            $('.editorAction').eq(index).find('.checkItem>span').eq(j).val(option6[j]);
          }
        }
        myStorage.formContent[index-7].option=single.option;
        //console.log(myStorage);
      });
    }
    var fun7 = function(){
      $('.editorType7 input').on('blur',function(){
        title = $(this).val();
        single.title = title;
        var index = findActiveDom();
        $('.editorAction').eq(index).find('label').text(single.title);
        myStorage.formContent[index-7].title=single.title;
      });
      $('.editorType7 textarea').on('blur',function(){
        description = $(this).val();
        single.description = description;
        var index = findActiveDom();
        $('.editorAction').eq(index).find('.singlyText-description p').text(single.description);
        myStorage.formContent[index-7].description=single.description;
      });
    }
    var findActiveDom = function(){
      var len = $('.editorAction').length;
      for(var i = 0;i<len;i++){
        if($('.editorAction').eq(i).hasClass('editing')){
          return i;
        }
      }
    }
    switch (num){
      case 1:
            fun1();
            break;
      case 2:
            fun2();
            break;
      case 3:
            fun3();
            break;
      case 4:
            fun4();
            break;
      case 5:
            fun5();
            break;
      case 6:
            fun6();
            break;
      case 7:
            fun7();
            break;
      default:
            break;
    }

  }
  //$('#storeEditor').on('click',function(){
  //  myStorage.title = 'test';
  //})
  //添加组建(end)
  $('#goToStep3').on('click',function(){
    $.get('/questionnaire/ajaxStep3',function(data){
      $('#step2_content').html(data);
    });

  })
})
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
function renderLogic(data){
  $('#logicTable').empty();
  if(!data) return;
  data = data.split('&');
  var text = '';
  var myData = myStorage.formContent;
  data.forEach(function(c,i,arr){
    var q1 = c[0];
    var q2 = c[1];
    var a1 = c[2];
    var s1 = c[3]=='Y'?'必选':'不可选';
    var a2 = c[4];
    //<tr>
    //    <td>你喜欢的食物</td>
    //    <td>喜欢吃米饭吗</td>
    //    <td>米饭</td>
    //    <td>必选</td>
    //    <td>必选</td>
    //</tr>
    text+='<tr><td>'+myData[q1].title+'</td><td>';
    text+=myData[q2].title+'</td><td>';
    text+=myData[q1].option[a1]+'</td><td>';
    text+=myData[q2].option[a2]+'</td><td>';
    text+=s1+'</td></tr>';
  });
  $('#logicTable').append(text);
}
function addEditorAction(){
    //点击左侧组件到编辑部分
    $('.editorAction').on('click',function(){
      $('.editorAll').addClass('hidden');
      //console.log('addEditorAction');
      var flag = $('.editor3').hasClass('editorActive');
      if(!flag){
        $('.editor3').addClass('editorActive').siblings('li').removeClass('editorActive');
        //$('.editor3').addClass('editorActive');
        $('#operation3').removeClass('hidden').siblings('div').addClass('hidden');
        //$('#operation3').removeClass('hidden');
      }
      if($(this).hasClass('action1')){
          $('.editorType1').removeClass('hidden');
        }
        if($(this).hasClass('action2')){
          $('.editorType2').removeClass('hidden');
        }
        if($(this).hasClass('action3')){
          $('.editorType3').removeClass('hidden');
        }
        if($(this).hasClass('action4')){
          $('.editorType4').removeClass('hidden');
        }
        if($(this).hasClass('action5')){
          $('.editorType5').removeClass('hidden');
        }
        if($(this).hasClass('action6')){
          $('.editorType6').removeClass('hidden');
        }
        if($(this).hasClass('action7')){
          $('.editorType7').removeClass('hidden');
        }
    })

  }