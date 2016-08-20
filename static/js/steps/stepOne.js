/**
 * Created by lujiaju on 16/5/16.
 */
function renderMyQuestions(data){
    var len = data.length;
    //console.log('题目长度'+len);
    for(var i=0;i<len;i++){
        //console.log('题目类型');
        //console.log(data[i].type);
        switch (data[i].type){
            case 'question1':
                $('.modelShowBody').append($('.action1').eq(0).clone().removeClass('hidden'));
                $('.editorAction').eq(7+i).find('label').text(data[i].title);
                $('.editorAction').eq(7+i).find('.singlyText-description p').text(data[i].description);
                break;
            case 'question2':
                $('.modelShowBody').append($('.action2').eq(0).clone().removeClass('hidden'));
                $('.editorAction').eq(7+i).find('label').text(data[i].title);
                $('.editorAction').eq(7+i).find('.singlyText-description p').text(data[i].description);
                break;
            case 'question3':
                $('.modelShowBody').append($('.action3').eq(0).clone().removeClass('hidden'));
                $('.editorAction').eq(7+i).find('label').text(data[i].title);
                $('.editorAction').eq(7+i).find('.singlyText-description p').text(data[i].description);
                break;
            case 'question4':
                $('.modelShowBody').append($('.action4').eq(0).clone().removeClass('hidden'));
                $('.editorAction').eq(7+i).find('label').text(data[i].title);
                $('.editorAction').eq(7+i).find('.singlyText-description p').text(data[i].description);
                for(var j = 0;j<3;j++){
                  $('.editorAction').eq(7+i).find('.myDrop>option').eq(j).text(data[i].options[j].option);
                }
                break;
            case 'question5':
                $('.modelShowBody').append($('.action5').eq(0).clone().removeClass('hidden'));
                $('.editorAction').eq(7+i).find('label').text(data[i].title);
                $('.editorAction').eq(7+i).find('.singlyText-description p').text(data[i].description);
                for(var j = 0;j<3;j++){
                  $('.editorAction').eq(7+i).find('.checkItem>span').eq(j).text(data[i].options[j].option);
                  $('.editorAction').eq(7+i).find('.checkItem>input').eq(j).val(data[i].options[j].option);
                  $('.editorAction').eq(7+i).find('.checkItem>input').eq(j).attr('name',i);
                }
                break;
            case 'question6':
                $('.modelShowBody').append($('.action6').eq(0).clone().removeClass('hidden'));
                $('.editorAction').eq(7+i).find('label').text(data[i].title);
                $('.editorAction').eq(7+i).find('.singlyText-description p').text(data[i].description);
                for(var j = 0;j<3;j++){
                  $('.editorAction').eq(7+i).find('.checkItem>span').eq(j).text(data[i].options[j].option);
                  $('.editorAction').eq(7+i).find('.checkItem>input').eq(j).val(data[i].options[j].option);
                }
                break;
            case 'question7':
                var file =  $('.action7').eq(0).clone().removeClass('hidden');
                file.find("input[type=file]").attr("name","file"+data[i].id);
                $('.modelShowBody').append(file);
                $('.editorAction').eq(7+i).find('label').text(data[i].title);
                $('.editorAction').eq(7+i).find('.singlyText-description p').text(data[i].description);
                break;
        }
    }
}
$(function(){
    var recentData;
    $('.userModels').on('click',function(e){
        e.preventDefault();
        var index = $(this).data('model');
        var renderData = JSON.parse(recentData[index]).elements;
        var questionId = JSON.parse(recentData[index]).questionnaireId;
        $('.nextStep').attr('href','/questionnaire/step2?questionnaireId='+questionId);
        console.log('id: '+questionId);
        console.log(index);
        $('.modelShowBody').empty();
        var text = '<div class="paperHead" id="title"><label>'+JSON.parse(recentData[index]).title+'</label></div>';
        $('.modelShowBody').append(text);
        renderMyQuestions(renderData);

    });

    $('#defaultModel').on('click',function(){
        var text = '<div class="paperHead" id="title"><label>就餐满意度调查</label></div>';
        text += '<div class="questionSingle action6 editorAction"><label class="questionTitle">多选</label><span class="glyphicon glyphicon-remove  rmBtn hidden"></span>';
        text += '<div class="singlyText-description"><p></p></div>';
        text += '<div class="checkList">';
        text += '<div class="checkItem"><input type="checkbox" name="1th"><span>非常干净</span></div>';
        text += '<div class="checkItem"><input type="checkbox" name="1th"><span>非常干净</span></div>';
        text += '<div class="checkItem"><input type="checkbox" name="1th"><span>非常干净</span></div>';
        text += '</div></div>';
        for(var i=0;i<10;i++){
            text += '<div class="questionSingle action6 editorAction"><label class="questionTitle">多选</label><span class="glyphicon glyphicon-remove  rmBtn hidden"></span>';
            text += '<div class="singlyText-description"><p></p></div>';
            text += '<div class="checkList">';
            text += '<div class="checkItem"><input type="checkbox" name="1th"><span>非常干净</span></div>';
            text += '<div class="checkItem"><input type="checkbox" name="1th"><span>非常干净</span></div>';
            text += '<div class="checkItem"><input type="checkbox" name="1th"><span>非常干净</span></div>';
            text += '</div></div>';
        }
        $('.modelShowBody').empty().append(text);
    });
    $.get('/questionnaire/ajaxLatestQuestinnaires',function(data){
        var tmp = JSON.parse(data);
        var lists= Object.getOwnPropertyNames(tmp);
        recentData = tmp;
        $('#history1').text(JSON.parse(tmp[0]).title);
        $('#history2').text(JSON.parse(tmp[1]).title);
        $('#history3').text(JSON.parse(tmp[2]).title);
        console.log(JSON.parse(tmp[0]).elements);
        console.log(JSON.parse(tmp[1]).elements);
        console.log(JSON.parse(tmp[2]).elements);
        //console.log(JSON.parse(data));
        //console.log(JSON.parse(tmp[0]));
        //console.log('JSON.parse(tmp[length]): ');
        //console.log(JSON.parse(tmp[length]));
        //console.log(JSON.parse(tmp[0]).elements);
        //console.log(lists.join());
        //$('.modelShowBody').empty();
        //renderMyQuestions(JSON.parse(tmp[2]).elements);
    });
})