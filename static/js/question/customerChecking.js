/**
 * Created by lujiaju on 16/3/23.
 */
var mockData = [
    {
        user:'tom1',
        content:'问卷第二题编辑有错',
        time:'2016-2-12-11:30 AM'
    },
    {
        user:'tom2',
        content:'问卷第二题编辑有错',
        time:'2016-2-12-11:30 AM'
    },
    {
        user:'tom3',
        content:'问卷第二题编辑有错',
        time:'2016-2-12-11:30 AM'
    }
]
$(function(){
    var indexNum = location.href.substring(location.href.indexOf('id')+3);
    $.get('/questionnaire/ajaxQuestionnaireAuditDetail?id='+indexNum,function(data){
        renderMyQuestions(JSON.parse(data).elements);
        $('.editorAction input').attr('readonly','readonly');
        $('.editorAction input').attr('disabled','disabled');
        $('.editorAction textarea').attr('readonly','readonly');
        $('.editorAction option').attr('disabled','disabled');
    });
})
function renderMyQuestions(data){
    var len = data.length;
    //console.log('题目长度'+len);
    for(var i=0;i<len;i++){
        //console.log('题目类型');
        //console.log(data[i].type);
        switch (data[i].type){
            case 'question1':
                $('.formBody').append($('.action1').eq(0).clone().removeClass('hidden'));
                $('.editorAction').eq(7+i).find('label').text(data[i].title);
                $('.editorAction').eq(7+i).find('.singlyText-description p').text(data[i].description);
                $('.editorAction').eq(7+i).find('.singlyText-input input').val(data[i].results[0].answer);

                break;
            case 'question2':
                $('.formBody').append($('.action2').eq(0).clone().removeClass('hidden'));
                $('.editorAction').eq(7+i).find('label').text(data[i].title);
                $('.editorAction').eq(7+i).find('.singlyText-description p').text(data[i].description);
                $('.editorAction').eq(7+i).find('.singlyText-input input').val(data[i].results[0].answer);
                break;
            case 'question3':
                $('.formBody').append($('.action3').eq(0).clone().removeClass('hidden'));
                $('.editorAction').eq(7+i).find('label').text(data[i].title);
                $('.editorAction').eq(7+i).find('.singlyText-description p').text(data[i].description);
                $('.editorAction').eq(7+i).find('.singlyText-input textarea').val(data[i].results[0].answer);
                break;
            case 'question4':
                $('.formBody').append($('.action4').eq(0).clone().removeClass('hidden'));
                $('.editorAction').eq(7+i).find('label').text(data[i].title);
                $('.editorAction').eq(7+i).find('.singlyText-description p').text(data[i].description);
                for(var j = 0;j<3;j++){
                  $('.editorAction').eq(7+i).find('.myDrop>option').eq(j).text(data[i].options[j].option);
                  $('.editorAction').eq(7+i).find('.myDrop>option').eq(j).val(data[i].options[j].option);
                  if(data[i].options[j].option==data[i].results[0].answer){
                    $('.editorAction').eq(7+i).find('.myDrop').val(data[i].results[0].answer);
                  }
                }
                break;
            case 'question5':
                $('.formBody').append($('.action5').eq(0).clone().removeClass('hidden'));
                $('.editorAction').eq(7+i).find('label').text(data[i].title);
                $('.editorAction').eq(7+i).find('.singlyText-description p').text(data[i].description);
                //$('.editorAction').eq(7+i).find('.checkItem>input').attr('disabled','disabled');
                for(var j = 0;j<3;j++){
                  $('.editorAction').eq(7+i).find('.checkItem>span').eq(j).text(data[i].options[j].option);
                  $('.editorAction').eq(7+i).find('.checkItem>input').eq(j).val(data[i].options[j].option);
                  $('.editorAction').eq(7+i).find('.checkItem>input').eq(j).attr('name',i);
                  if(data[i].options[j].option==data[i].results[0].answer){
                    $('.editorAction').eq(7+i).find('.checkItem>input').eq(j).attr('checked','checked');
                  }
                }
                break;
            case 'question6':
                $('.formBody').append($('.action6').eq(0).clone().removeClass('hidden'));
                $('.editorAction').eq(7+i).find('label').text(data[i].title);
                $('.editorAction').eq(7+i).find('.singlyText-description p').text(data[i].description);
                //$('.editorAction').eq(7+i).find('.checkItem>input').attr('disabled','disabled');
                for(var j = 0;j<3;j++){
                  $('.editorAction').eq(7+i).find('.checkItem>span').eq(j).text(data[i].options[j].option);
                  $('.editorAction').eq(7+i).find('.checkItem>input').eq(j).val(data[i].options[j].option);
                  if(data[i].results[0].answer.indexOf(data[i].options[j].option)>0){
                      $('.editorAction').eq(7+i).find('.checkItem>input').eq(j).attr('checked','checked');

                  }

                }
                break;
            case 'question7':
                $('.formBody').append($('.action7').eq(0).clone().removeClass('hidden'));
                $('.editorAction').eq(7+i).find('label').text(data[i].title);
                $('.editorAction').eq(7+i).find('.singlyText-description p').text(data[i].description);
                $('.editorAction').eq(7+i).find('.uploadFile a').attr('href','/'+data[i].results[0].answer);
                break;
        }
    }
}