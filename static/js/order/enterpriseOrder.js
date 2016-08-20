/**
 * Created by lujiaju on 16/2/18.
 */
$(function(){
    $('#modifyOrder').on('click',function(){
        if($('.editoringOrder').hasClass('hidden')){
            console.log('1')
            $('.editoringOrder').removeClass('hidden')
            return
        }
        if(!$('.editoringOrder').hasClass('hidden')){
            console.log('2')
            $('.editoringOrder').addClass('hidden')
            return
        }
    })
    function sumAll(){
        var amt = 0;
        var orderAmt = $("#orderAmount").val();
        $(".storeNum").each(function(){
            if(!isNaN($(this).val())&&!isNaN(orderAmt)){
                amt += parseFloat(($(this).val()*orderAmt).toFixed(2));
            }
        })
        $("#orderSumAll").text(amt);
    }
   //click"编辑订单"
    $('#editorOrder').on('click',function(){
        console.log('hi');
        $('.displayOrder').addClass('hidden');
        $('.editoringOrder').removeClass('hidden');
    });
    //编辑订单
    $('#orderAmount').on('change',function(){
        console.log('changing!');
        var a = $(this).val();
        var b = $('#orderNum').val();
        $(".storeNum").each(function(){
            var id = $(this).attr("data-src");
            if(!isNaN($(this).val())&&!isNaN(a)){
            $('#orderSum'+id).text(($(this).val()* a).toFixed(2));
            }
        })
        sumAll();
        $(this).prev().text(a)
    });
    $('.storeNum').on('change',function(){
        console.log('changing!');
        var a = $(this).val();
        var b = $('#orderAmount').val();
        var id = $(this).attr("data-src");
        if(!isNaN(a)&&!isNaN(b)){
            $('#orderSum'+id).text((a* b).toFixed(2));
            sumAll();
        }
        $(this).prev().text('('+a+')')
    });

    //click"cancelOrder"
    $('#cancelOrder').on('click',function(){
        var a = confirm('确定取消订单吗?');
        var orderId = $('#orderId').val();
        if(a==true){
            //console.log('已取消订单');
            window.location.href= "/payment/cancel?id="+orderId;
        }
    });
    $('#goPay').on('click',function(){
        var data = {
            amount:$('#orderAmount').val(),
            num:$('#orderNum').val(),
            id:$('#orderNO').val()
        }
        $.post('/payment/pay',data,function(success){
            console.log('post success');
        });
    });
    $("#orderPayBtn").click(function (e) {
        if (confirm("确定支付当前订单么")) {
            if($('#infoStatus').val()=='I'){
                $('#myModal').modal('show');
                e.preventDefault();
                $('.infoError').removeClass('hidden');
                return;
            }
            if($('#infoStatus').val()=='A'){
                $('#myModal').modal('show');
                e.preventDefault();
                $('.infoError2').removeClass('hidden');
                return;
            }
            var storeNum = [];
            $(".storeNum").each(function(){
                var num = {};
                num.id = $(this).attr("data-store-id");
                num.num = $(this).val();
                storeNum.push(num);
            })
            console.log(JSON.stringify( storeNum ));
            $("#submitStoreNum").val(JSON.stringify( storeNum ));

            //alert("尚未配置支付宝，敬请期待");
            $("#orderPayForm").submit();
        }
    })
});
