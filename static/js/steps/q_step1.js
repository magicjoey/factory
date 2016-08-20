/**
 * Author: Ben
 * Description:
 * Created: 2016-01-10 上午10:45 q_step1
 * Version: 1.0
 */
var myStorage;
if(!myStorage){
  myStorage = {
      title:'问卷未命名',
      description:'没有描述文字',
      formContent:[],
      logic:'N',
      logicContent:'',
      gmtEnd:'',
  };
}else {
    $('#question_title').text(myStorage.title);
    renderMyQuestions(myStorage.formContent);
}
//更新逻辑表
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
//实时列出下拉列表
function showLogicList(dom){
  $(dom).empty();
  var data = myStorage.formContent;
  if(!data) return;
  //<option value="dsfa">  选项1 </option>
  var text = '';
  data.forEach(function(c,i,arr){
    text += '<option value="'+i+'">'+ c.title+'</option>';
  });
  $(dom).append(text);
}
function showLogicQuestionItems(dom,index){
  $(dom).empty();
  var data = myStorage.formContent[index];
  if(!data) return;
  if(!data.option) return;
  data = data.option;
  //<option value="dsfa">  选项1 </option>
  var text = '';
  data.forEach(function(c,i,arr){
    text += '<option value="'+i+'">'+ c+'</option>';
  });
  $(dom).append(text);
}
//渲染stores
function renderStores(){
  //<div class="store">
  //<input type="checkbox" name="storeItem" value="1">
  //<span>金钱豹淮海路店</span>
  //</div>
  //$('#storeList').append();
  /*获得stores*/
  $('#storeList').empty();
  var git = [];
  //var stores = [];
  $.get('/questionnaire/ajaxStores',function(data){
    git = JSON.parse(data);
    console.log(typeof data);
    //git  = [{"pk": 1, "fields": {"city": 2801, "area": 2853,
    //  "detail_address": "\u5317\u4eac\u897f\u57ce\u533a\u4e8c\u73af\u5230\u4e09\u73affaskdfjkasj77",
    //  "address": "faskdfjkasj77", "companyId": 61, "operator": 61, "name": "1fksjdfk",
    //  "gmtCreate": "2016-05-08T04:33:57Z", "gmtUpdate": "2016-05-08T05:24:04Z", "province": 1},
    //  "model": "questionnaire.store"}]
    var tmp = '';
    git.forEach(function(c,i,arr){
      tmp += '<div class="store">';
      tmp += '<input type="checkbox" name="storeItem" value="';
      tmp += c.pk;
      tmp += '" data-text="';
      tmp += c.fields.name;
      tmp += '">';
      tmp += '<span>';
      tmp += c.fields.name;
      tmp += '</span> </div>';
      //stores.push({id: c.pk,name: c.fields.name});
    });
    $('#storeList').append(tmp);
    $('.store').on('click','input[name="storeItem"]',function(){
      var store_value = $(this).data('text')
      if($(this).is(':checked')){
        console.log('选中')
      }
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
    myStorage.storeList = selectedStores;

    if(selectedStores.length>0){
      var storeListShow = '';
      selectedStores.forEach(function(item,index){
        storeListShow += '<p>'
        storeListShow += item.name;
        storeListShow += '</p>'
      })
    }else {
      var storeListShow = '尚未选择门店';
    }
    $('#storeList2').html(storeListShow)
  });
}
$(function(){
  /**/
  renderStores();
  //截止日期
  $(".form_datetime").on('click',function(){
    myStorage.gmtEnd = $(this).val();
  });
  $('.editorAction input').attr('readonly','readonly');
  $('.editorAction input').attr('disabled','disabled');
  $('.editorAction textarea').attr('readonly','readonly');
  $('.editorAction option').attr('disabled','disabled');

  var questionsIndex = 0;
  //给逻辑问题A加个实时加载
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
  $('input[name=age]').on('click',function(){
    renderSelects('needAge')
  });
  $('input[name=sex]').on('click',function(){
    renderSelects('needSex')
  });
  $('input[name=occupation]').on('click',function(){
    renderSelects('needOccupation');
  });
  //渲染select组件
  function renderSelects(value){
    $('#mainSelect').empty();
    switch (value){
      case 'needAge':
            renderAge();
            break;
      case 'needSex':
            renderGender();
            break;
      case 'needOccupation':
            renderWork();
            break;
    }
  }
  //<option value="">123</option>
  function renderAge(){
    var dom = $('<option></option>');
    var dom1 = $('<option value="18">18岁以上</option>');
    var dom2 = $('<option value="30">22岁以上</option>');
    var dom3 = $('<option value="30">30岁以上</option>');
    $('#mainSelect').append(dom);
    $('#mainSelect').append(dom1);
    $('#mainSelect').append(dom2);
    $('#mainSelect').append(dom3);
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
    changeActiveDom();
    addEditorAction();
    changeActiveValue(1);
    addHoverFlag();
    console.log('in clone')
  }
  function cloneDom2(){
    $('.paperBody').append($('.action2').eq(0).clone().removeClass('hidden'));
    hoverAndRemove();
    changeActiveDom();
    addEditorAction();
    changeActiveValue(2);
    addHoverFlag();
  }
  function cloneDom3(){
    $('.paperBody').append($('.action3').eq(0).clone().removeClass('hidden'));
    hoverAndRemove();
    changeActiveDom();
    addEditorAction();
    changeActiveValue(3);
  }
  function cloneDom4(){
    $('.paperBody').append($('.action4').eq(0).clone().removeClass('hidden'));
    hoverAndRemove();
    changeActiveDom();
    addEditorAction();
    changeActiveValue(4);
  }
  function cloneDom5(){
    $('.paperBody').append($('.action5').eq(0).clone().removeClass('hidden'));
    hoverAndRemove2();
    changeActiveDom();
    addEditorAction();
    changeActiveValue(5);
  }
  function cloneDom6(){
    $('.paperBody').append($('.action6').eq(0).clone().removeClass('hidden'));
    hoverAndRemove2();
    changeActiveDom();
    addEditorAction();
    changeActiveValue(6);
  }
  function cloneDom7(){
    $('.paperBody').append($('.action7').eq(0).clone().removeClass('hidden'));
    hoverAndRemove2();
    changeActiveDom();
    addEditorAction();
    changeActiveValue(7);
  }
  function cloneDom7Child(){
    $('.operationSettings').append($('.action7Child').eq(0).clone().removeClass('hidden'));
  }

  function hoverAndRemove2(){
    //组建类型为questionSingle
    $('.questionSingle').hover(function(){
      $(this).find('.rmBtn').removeClass('hidden');
    },function(){
      $(this).find('.rmBtn').addClass('hidden');
    });

    $('.rmBtn').unbind('click').on('click',function(){
      $(this).parent().remove();
      var index = findActiveDom2();
      myStorage.formContent.splice(index-7,1);
      console.log('qwe')
    });
  }

  /*实时编辑*/

  function createData(num){
    var normalQ = {
      title:'',
      description:''
    };
    var unordinaryQ = {
      title:'',
      description:'',
      option:['','','']
    }
    var unordinaryQ_score1 = {
      title:'',
      description:'',
      option:['','',''],
      score:'10',
      optionScore:['10','0','0']
    }
    var unordinaryQ_score2 = {
      title:'',
      description:'',
      option:['','',''],
      score:'10',
      optionScore:['5','3','2']
    }
    //questionsIndex++;
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
            unordinaryQ_score1.type = 'question4';
            myStorage.formContent.push(unordinaryQ_score1);
            break;
      case 5:
            unordinaryQ_score1.type = 'question5';
            myStorage.formContent.push(unordinaryQ_score1);
            break;
      case 6:
            unordinaryQ_score2.type = 'question6';
            myStorage.formContent.push(unordinaryQ_score2);
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

  //$('#storeEditor').on('click',function(){
  //  myStorage.title = 'test';
  //})
  //添加组建(end)
  $('#goToStep3').on('click',function(e){
    e.preventDefault();
    if(myStorage.formContent.length<1) {
      $('#blankQ').removeClass('hidden');
      setTimeout(function(){
        $('#blankQ').addClass('hidden');
      },2000);
      return;
    }
    if(!myStorage.storeList){
      confirm('门店信息不能为空!请点击所属门店设置');
      return;
    }
    $.get('/questionnaire/ajaxStep3',function(data){
      $('#step2_content').html(data);
    });

  });
  //分值设置
  $('.setScore input').on('blur',function(){
    var p = /^\d*$/g;
    var tmp = $(this).val();
    if(!tmp) return;
    if(!(p.test(tmp))){
      $('.setScoreMgs').removeClass('hidden');
    }
  })
  $('.setScore input').on('focus',function(){
    $('.setScoreMgs').addClass('hidden')
  })
})
function getQueryString(str){
  var myQuery = location.search;
  myQuery = myQuery.split('&');
  var result = '';
  myQuery.forEach(function(e,i,arr){
    if(e.indexOf(str)>-1){
      var indexFlag = e.indexOf('=');
      result =  e.substring(indexFlag+1);
    }
  })
  return result;
}
var indexNum = getQueryString('questionnaireId');
if(indexNum){
  $.get('/questionnaire/ajaxQuestionnaireDetail?id='+indexNum,function(data){
      console.log(JSON.parse(data));
      var renderData = JSON.parse(data);
      var content = renderData.elements;
      //渲染标题
      $('#question_title').text(renderData.title);
      //渲染题目
      renderHistory(content);
      hoverAndRemove();
      changeActiveDom();
      addEditorAction();
      addHoverFlag();
      var target = renderData.elements;
      var result = []
      if(target && target.length>1){
        target.forEach(function(c,i,arr){
          if(c.type == "question4" || c.type== "question5" || c.type == "question6"){
            if(c.options && c.options.length>0){
              var tmp = [];
              var tmpScore = [];
              c.options.forEach(function(cc){
                tmp.push(cc.option)
                tmpScore.push(cc.optionScore)
              })
              c.option = tmp
              c.optionScore = tmpScore
              result.push(c)
            }else{
              result.push(c)
            }
          }
          else {
            result.push(c)
          }
        })
      }
      var num;
      for(var i=0 ; i<result.length;i++){
        myStorage.formContent.push(result[i]);
        num = result[i].type[8];
        changeActiveValue(num);
      }


});
}
function changeActiveValue(num){
    num = parseInt(num);
    var title,description,single={};
    //editorType1,2,3,4,5,6,7
    var fun1 = function(){
      $('.editorType1').on('mouseover',function(){
      })
      $('.editorType1 input').on('blur',function(){
        title = $(this).val();
        single.title = title;
        if(!title) return;
        var index = findActiveDom();
        $('.editorAction').eq(index).find('label').text(single.title);
        myStorage.formContent[index-7].title=single.title;

      });
      $('.editorType1 textarea').on('blur',function(){
        description = $(this).val();
        single.description = description;
        var index = findActiveDom();
        if(!description) return;
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
        if(!title) return;
        $('.editorAction').eq(index).find('label').text(single.title);
        myStorage.formContent[index-7].title=single.title;
      });
      $('.editorType2 textarea').on('blur',function(){
        description = $(this).val();
        single.description = description;
        var index = findActiveDom();
        if(!description) return;
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
        if(!title) return;
        $('.editorAction').eq(index).find('label').text(single.title);
        myStorage.formContent[index-7].title=single.title;
      });
      $('.editorType3 textarea').on('blur',function(){
        description = $(this).val();
        single.description = description;
        var index = findActiveDom();
        if(!description) return;
        $('.editorAction').eq(index).find('.singlyText-description p').text(single.description);
        myStorage.formContent[index-7].description=single.description;
        //console.log(myStorage);
      });
    }
    var fun4 = function(){
      console.log('dropdown')
      $('.editorType4>input').on('blur',function(){
        title = $(this).val();
        single.title = title;
        var index = findActiveDom();
        if(!title) return;
        $('.editorAction').eq(index).find('label').text(single.title);
        myStorage.formContent[index-7].title=single.title;
      });
      $('.editorType4 input[name="sumScore"]').on('blur',function(){
        var index = findActiveDom();
        var tmp = $(this).val();
        if(!tmp) return;
        single.score = tmp;
        myStorage.formContent[index-7].score=single.score;
      });
      $('.editorType4 input[name="scoreOption"]').on('blur',function(){
        var index = findActiveDom();
        var tmp = $(this).val();
        if(!tmp) return;
        var eq = $(this).data('count');
        myStorage.formContent[index-7].optionScore[eq]=tmp;
      });
      $('.editorType4 textarea').on('blur',function(){
        description = $(this).val();
        single.description = description;
        var index = findActiveDom();
        if(!description) return;
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
        if(!title) return;
        $('.editorAction').eq(index).find('label').text(single.title);
        myStorage.formContent[index-7].title=single.title;
      });
      $('.editorType5 input[name="sumScore"]').on('blur',function(){
        var index = findActiveDom();
        var tmp = $(this).val();
        if(!tmp) return;
        single.score = tmp;
        myStorage.formContent[index-7].score=single.score;
      });
      $('.editorType5 input[name="scoreOption"]').on('blur',function(){
        var index = findActiveDom();
        var tmp = $(this).val();
        if(!tmp) return;
        var eq = $(this).data('count');
        myStorage.formContent[index-7].optionScore[eq]=tmp;
      });
      $('.editorType5 textarea').on('blur',function(){
        description = $(this).val();
        single.description = description;
        var index = findActiveDom();
        if(!description) return;
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
      $('.editorType6 > input').on('blur',function(){
        title = $(this).val();
        single.title = title;
        var index = findActiveDom();
        if(!title) return;
        $('.editorAction').eq(index).find('label').text(single.title);
        myStorage.formContent[index-7].title=single.title;
      });
      $('.editorType6 input[name="sumScore"]').on('blur',function(){
        var index = findActiveDom();
        var tmp = $(this).val();
        if(!tmp) return;
        single.score = tmp;
        myStorage.formContent[index-7].score=single.score;
      });
      $('.editorType6 input[name="scoreOption"]').on('blur',function(){
        var index = findActiveDom();
        var tmp = $(this).val();
        if(!tmp) return;
        var eq = $(this).data('count');
        myStorage.formContent[index-7].optionScore[eq]=tmp;
      });
      $('.editorType6 textarea').on('blur',function(){
        description = $(this).val();
        single.description = description;
        var index = findActiveDom();
        if(!description) return;
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
        if(!title) return;
        $('.editorAction').eq(index).find('label').text(single.title);
        myStorage.formContent[index-7].title=single.title;
      });
      $('.editorType7 textarea').on('blur',function(){
        description = $(this).val();
        single.description = description;
        var index = findActiveDom();
        if(!description) return;
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

function findActiveDom3(){
    var len = $('.editorAction').length;
    for(var i = 0;i<len;i++){
      if($('.editorAction').eq(i).hasClass('editing')){
        return i;
      }
    }
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
      var index = findActiveDom3()-7;
      console.log(index)
      if($(this).hasClass('action1')){
          $('.editorType1').removeClass('hidden');
          $('.editorType1').find('input').val(myStorage.formContent[index].title);
          $('.editorType1').find('textarea').val(myStorage.formContent[index].description);
        }
        if($(this).hasClass('action2')){
          $('.editorType2').removeClass('hidden');
          $('.editorType2').find('input').val(myStorage.formContent[index].title);
          $('.editorType2').find('textarea').val(myStorage.formContent[index].description);
        }
        if($(this).hasClass('action3')){
          $('.editorType3').removeClass('hidden');
          $('.editorType3').find('input').val(myStorage.formContent[index].title);
          $('.editorType3').find('textarea').val(myStorage.formContent[index].description);
        }
        if($(this).hasClass('action4')){
          $('.editorType4').removeClass('hidden');
          $('.editorType4').find('input').eq(0).val(myStorage.formContent[index].title);
          if(myStorage.formContent[index].option.length == 0){return}
          $('.editorType4').find('input').eq(1).val(myStorage.formContent[index].option[0]);
          $('.editorType4').find('input').eq(2).val(myStorage.formContent[index].option[1]);
          $('.editorType4').find('input').eq(3).val(myStorage.formContent[index].option[2]);
          $('.editorType4').find('textarea').val(myStorage.formContent[index].description);
        }
        if($(this).hasClass('action5')){
          $('.editorType5').removeClass('hidden');
          $('.editorType5').find('input').eq(0).val(myStorage.formContent[index].title);
          if(myStorage.formContent[index].option.length == 0){return}
          $('.editorType5').find('input').eq(1).val(myStorage.formContent[index].option[0]);
          $('.editorType5').find('input').eq(2).val(myStorage.formContent[index].option[1]);
          $('.editorType5').find('input').eq(3).val(myStorage.formContent[index].option[2]);
          $('.editorType5').find('textarea').val(myStorage.formContent[index].description);
        }
        if($(this).hasClass('action6')){
          $('.editorType6').removeClass('hidden');
          $('.editorType6').find('input').eq(0).val(myStorage.formContent[index].title);
          if(myStorage.formContent[index].option.length == 0){return}
          $('.editorType6').find('input').eq(1).val(myStorage.formContent[index].option[0]);
          $('.editorType6').find('input').eq(2).val(myStorage.formContent[index].option[1]);
          $('.editorType6').find('input').eq(3).val(myStorage.formContent[index].option[2]);
          $('.editorType6').find('textarea').val(myStorage.formContent[index].description);
        }
        if($(this).hasClass('action7')){
          $('.editorType7').removeClass('hidden');
          $('.editorType7').find('input').val(myStorage.formContent[index].title);
          $('.editorType7').find('textarea').val(myStorage.formContent[index].description);
        }
    })

  }
function renderHistory(data){
    if(!data){return}
    var len = data.length;
    //console.log('题目长度'+len);
    for(var i=0;i<len;i++){
        //console.log('题目类型');
        //console.log(data[i].type);
      console.log('渲染历史问题')
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
                console.log(i,data[i]);
                $('.paperBody').append($('.action4').eq(0).clone().removeClass('hidden'));
                $('.editorAction').eq(7+i).find('label').text(data[i].title);
                $('.editorAction').eq(7+i).find('.singlyText-description p').text(data[i].description);
                if(data[i].options.length==0) break
                for(var j = 0;j<3;j++){
                  console.log();
                  $('.editorAction').eq(7+i).find('.myDrop>option').eq(j).text(data[i].options[j].option);
                  $('.editorAction').eq(7+i).find('.myDrop>option').eq(j).val(data[i].options[j].option);
                  $('.editorAction').eq(7+i).find('.checkItem>input').eq(j).attr('name',i);
                }
                break;
            case 'question5':
                $('.paperBody').append($('.action5').eq(0).clone().removeClass('hidden'));
                $('.editorAction').eq(7+i).find('label').text(data[i].title);
                $('.editorAction').eq(7+i).find('.singlyText-description p').text(data[i].description);
                if(data[i].options.length==0) break;
                for(var j = 0;j<3;j++){
                  $('.editorAction').eq(7+i).find('.checkItem>span').eq(j).text(data[i].options[j].option);
                  $('.editorAction').eq(7+i).find('.checkItem>input').eq(j).val(data[i].options[j].option);
                  $('.editorAction').eq(7+i).find('.checkItem>input').eq(j).attr('name',i);
                }
                break;
            case 'question6':
                $('.paperBody').append($('.action6').eq(0).clone().removeClass('hidden'));
                $('.editorAction').eq(7+i).find('label').text(data[i].title);
                $('.editorAction').eq(7+i).find('.singlyText-description p').text(data[i].description);
                if(data[i].options.length==0) break
                for(var j = 0;j<3;j++){
                  $('.editorAction').eq(7+i).find('.checkItem>span').eq(j).text(data[i].options[j].option);
                  $('.editorAction').eq(7+i).find('.checkItem>input').eq(j).val(data[i].options[j].option);
                  $('.editorAction').eq(7+i).find('.checkItem>input').eq(j).attr('name',i);
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
function hoverAndRemove(){
    //组建类型为singlyText
    $('.singlyText').hover(function(){
      $(this).find('.rmBtn').removeClass('hidden');
    },function(){
      $(this).find('.rmBtn').addClass('hidden');
    });

    $('.rmBtn').unbind('click').on('click',function(){
      $(this).parent().remove();
      var index = findActiveDom2();
      myStorage.formContent.splice(index-7,1);
      console.log('123')
    });
}
function findActiveDom2(){
      var len = $('.editorAction').length;
      for(var i = 0;i<len;i++){
        if($('.editorAction').eq(i).hasClass('removeFlag')){
          return i;
        }
      }
}
function addHoverFlag(){
  $('.editorAction').hover(function(){
    $(this).addClass('removeFlag');
    //console.log('1')
  },function(){
    $(this).removeClass('removeFlag');
    //console.log('2')
  });
}