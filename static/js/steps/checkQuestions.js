/**
 * Created by lujiaju on 16/2/17.
 */
/**
 * Created by lujiaju on 16/2/15.
 */
var mockData = {
    title:'问卷1',
    description:'测试问卷',
    content:[
        {
            title:'题目1',
            description:'测试题目1',
            type:'question1'
        },
        {
            title:'题目2',
            description:'测试题目2',
            type:'question2'
        },
        {
            title:'题目3',
            description:'测试题目3',
            type:'question3'
        },
        {
            title:'题目4',
            description:'测试题目4',
            option:['下拉选项1','下拉选项2','下拉选项3'],
            type:'question4'
            //下拉菜单
        },
        {
            title:'题目5',
            description:'测试题目5',
            option:['选项1','选项2','选项3'],
            type:'question5'
            //单选
        },
        {
            title:'题目6',
            description:'测试题目6',
            option:['多选1','多选2','多选3'],
            type:'question6'
            //多选
        },
        {
            title:'题目7',
            description:'测试题目7',
            type:'question7'
        }
    ],
}
$(function(){
    var data = mockData;
    //渲染标题
    $('#title').text(data.title);
    //渲染题目
    renderMyQuestions(data.content);
    //发送数据

});
function renderMyQuestions(data){
    var len = data.length;
    console.log('题目长度'+len);
    for(var i=0;i<len;i++){
        console.log('题目类型');
        console.log(data[i].type);
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

