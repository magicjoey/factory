/**
 * Created by lujiaju on 16/2/19.
 */
var showV;
$(function(){
    //var data = mockData;
    //renderMyQuestions(data.content);
    //发送数据
    var tmp = location.href;
    var indexNum = tmp.substring(tmp.indexOf('id')+3);
    $.get('/questionnaire/ajaxQuestionnaireDetail?id='+indexNum,function(data){
        //alert(data.name);
        //console.log(data);
        console.log(JSON.parse(data));
        var renderData = JSON.parse(data);
        var content = renderData.elements;
        var stores = renderData.stores;
        showV = content;
        //渲染标题
        $('#title').text(renderData.title);
        //渲染题目
        renderStores(renderData.stores);
        $('.storesList input').attr('readonly','readonly');
        $('.storesList input').attr('disabled','disabled');
        $('.storesList input').attr('checked','checked');
        renderMyQuestions(content);
        renderLogic(renderData.logicContent,content);
    });

});
function renderStores(stores) {
    //<ul id="storeGit">
    //                    <li>
    //                        <input type="checkbox" checked><span>上海三门店</span>
    //                    </li>
    //                    <li>
    //                        <input type="checkbox" checked><span>上海三门店</span>
    //                    </li>
    //                </ul>
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
                break;
            case 'question2':
                $('.formBody').append($('.action2').eq(0).clone().removeClass('hidden'));
                $('.editorAction').eq(7+i).find('label').text(data[i].title);
                $('.editorAction').eq(7+i).find('.singlyText-description p').text(data[i].description);
                break;
            case 'question3':
                $('.formBody').append($('.action3').eq(0).clone().removeClass('hidden'));
                $('.editorAction').eq(7+i).find('label').text(data[i].title);
                $('.editorAction').eq(7+i).find('.singlyText-description p').text(data[i].description);
                break;
            case 'question4':
                $('.formBody').append($('.action4').eq(0).clone().removeClass('hidden'));
                $('.editorAction').eq(7+i).find('label').text(data[i].title);
                $('.editorAction').eq(7+i).find('.singlyText-description p').text(data[i].description);
                for(var j = 0;j<3;j++){
                  $('.editorAction').eq(7+i).find('.myDrop>option').eq(j).text(data[i].options[j].option);
                }
                break;
            case 'question5':
                $('.formBody').append($('.action5').eq(0).clone().removeClass('hidden'));
                $('.editorAction').eq(7+i).find('label').text(data[i].title);
                $('.editorAction').eq(7+i).find('.singlyText-description p').text(data[i].description);
                for(var j = 0;j<3;j++){
                  $('.editorAction').eq(7+i).find('.checkItem>span').eq(j).text(data[i].options[j].option);
                  $('.editorAction').eq(7+i).find('.checkItem>input').eq(j).val(data[i].options[j].option);
                  $('.editorAction').eq(7+i).find('.checkItem>input').eq(j).attr('name',i);
                }
                break;
            case 'question6':
                $('.formBody').append($('.action6').eq(0).clone().removeClass('hidden'));
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
                $('.formBody').append(file);
                $('.editorAction').eq(7+i).find('label').text(data[i].title);
                $('.editorAction').eq(7+i).find('.singlyText-description p').text(data[i].description);
                break;
        }
    }
}
function renderLogic(content,formData){
    if(!content) return;
    var data = content.split('&');
    data.forEach(function(c,i,arr){
        var ques1 = c[0];//1
        var ques2 = c[1];//2
        var answer1 = c[2];//0
        var answer1_value;
        if(formData[ques1]){
          answer1_value = formData[ques1].options[answer1].option;
        }
        var answer2 = c[4];//1
        var status = c[3];//Y
        $('input:radio[name="'+ques1+'"]').change(function(){
            $('input:radio[name="'+ques2+'"]').prop('disabled',false);
            if($(this).val()==answer1_value){
                if(status=='Y'){
                    $('input:radio[name="'+ques2+'"]').prop('checked',false);
                    $('input:radio[name="'+ques2+'"]').prop('disabled','disabled');
                    $('input:radio[name="'+ques2+'"]').eq(answer2).prop('checked',true);
                }else {
                    $('input:radio[name="'+ques2+'"]').eq(answer2).prop('checked',false);
                    $('input:radio[name="'+ques2+'"]').eq(answer2).prop('disabled','disabled');
                }
            }else{
                if(status!='Y'){
                    $('input:radio[name="'+ques2+'"]').eq(answer2).prop('disabled',false);
                }
            }
        })
    });

}