function Post(){
    function bindEvent(){
        var base_url = location.protocol + "//" + document.domain + ":" + location.port;
        $(".post_edit").click(function(e){
            var params = {
                id : $(".id").val(),
                title : $(".title").val(),
                content : tinymce.get("content").getContent(),
                author : $(".author").val(),
            };          
            console.log(params);
            $.ajax({
                url : base_url + "/admin/post/edit",
                type : "PUT",
                data : params,
                dataType : "json",
                success : function (res){
                    if(res && res.status_code == 200){
                        location.reload
                    }
                }
            });
        });

        $(".post_delete").click(function(){
            var post_id = $(this).attr("post_id");
            $.ajax({
                url : base_url + "/admin/post/delete",
                type : "DELETE",
                data : {id: post_id},
                dataType : "json",
                success : function (res){
                    if(res && res.status_code == 200){
                        location.reload
                    }
                }
            });
        })
    }
    bindEvent();
}

$(document).ready(function(){
    new Post();
})