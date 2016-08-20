/**
 * Created by lujiaju on 16/2/27.
 */
$(function(){
    if(location.href.indexOf('&')<0) return;
    var evidence = location.href.slice(location.href.indexOf('&')+1).split('=')[1];
    //console.log('evidence: '+evidence);
    if(evidence == 'readyPost'){
        var tmp = '<button class="btn btn-default btn-block" data-toggle="modal" data-target="#myModal">提交</button>';
        $('#visitorQuestionBtn').html(tmp);
    }
    if(evidence == 'readyApply'){
        var tmp = '<button class="btn btn-default btn-block" data-toggle="modal" id="applyingP">申请领取</button>';
        $('#visitorQuestionBtn').html(tmp);
    }
    //申请领取
    $('#applyingP').on('click',function(e){
        //e.preventDefault();
        if($('#infoStatus').val()=='I'){
            $('#myModal3').modal('show');
            return;
        }
        if($('#infoStatus').val()=='A'){
            $('#myModal4').modal('show');
            return;
        }
        $('#myModal2').modal('show');
    });
    $('#visitorApplying').on('click',function(){
        var storeId = $("input[name=store]:checked").val();
        if(!storeId){
            alert("请选择门店");
            return;
        }
        var question_id = location.href.slice(location.href.indexOf('=')+1,location.href.indexOf('&'));
        //$(this).text('已申请').addClass('label-warning');
        $.post('/questionnaire/participate',{questionnaireId:question_id, storeId: storeId,csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},function(data){
            $('#applyErrorMsg').text(data.msg);
            $('#applyErrorBody').removeClass('hidden');
            setTimeout(function(){
              $('#myModal2').modal('hide');
            },1000);
        });
    });
    //打开补全页面
    $('#completeInfo').on('click',function(){
        window.open('/accounts/fillInfo');
    })
    //提交问卷
    $('#visitorPosting').on('click',function(){
        console.log(showV);
        var data = {};
        var tmp = [];
        var visitorResult =getVisitorAnswer();
        var flag = true;
        for(var q=0;q<visitorResult.length;q++){
            if(visitorResult[q]==false){
                flag = false;
                break;
            }
        }
        if(!flag){
            $('.modal-body').removeClass('hidden');
            setTimeout(function(){
                $('.modal-body').addClass('hidden');
                $('#myModal').modal('hide');
            },1000);
            return;
        }
        data.questionnaireId = location.href.slice(location.href.indexOf('=')+1,location.href.indexOf('&'));
        data.elements = [];
        data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
        for(var i = 0;i<showV.length;i++){
            var tmpObj = {};
            tmpObj.id=showV[i].id;
            tmpObj.answer=visitorResult[i];
            data.elements.push(tmpObj);
        }

        $('#formContent2').val(data.questionnaireId);
        $('#formContent1').val(JSON.stringify(data.elements));
        $('#visitorForm').submit();
        //$.post('/questionnaire/result',data,function(){
            //console.log('visitors post his answer to back-end!');
        //});
    });

});
function getVisitorAnswer(){
    var len = $('.editorAction').length;
    var answer = [];
    for(var i=7;i<len;i++){
        var obj = $('.editorAction').eq(i);
        if(obj.hasClass('action1')||obj.hasClass('action2')){
            answer.push(obj.find('input').val());
        }
        if(obj.hasClass('action3')){
            answer.push(obj.find('textarea').val());
        }
        if(obj.hasClass('action4')){
            answer.push(obj.find('.myDrop').val());
        }
        if(obj.hasClass('action5')){
            answer.push(obj.find('input:radio[name="'+(parseInt(i)-7)+'"]:checked').val());
        }
        if(obj.hasClass('action6')){
            var tmp = [];
            obj.find('input:checkbox[name="1th"]').each(function(){
                if($(this).is(':checked')){
                    tmp.push($(this).val());
                }
            });
            answer.push(tmp);
        }
        if(obj.hasClass('action7')){
            answer.push('附件');
        }
    }
    return answer;
}
