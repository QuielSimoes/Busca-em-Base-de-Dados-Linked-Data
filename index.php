<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>Protótipo de busca em base de dados Linked Data</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /> 
        <link href='css/geral.css' type='text/css' rel="stylesheet"/>        
        <link href='css/tagcloud.css' type='text/css' rel="stylesheet"/>        
        <link href='css/scrollableFixedHeaderTable.css' type='text/css' rel="stylesheet"/>        
        <script type='text/javascript' src='js/jquery_1.5.1.js'></script>
        <script type='text/javascript' src='js/jquery-ui-1.8.12.custom.min.js'></script>
		<script type="text/javascript" src="js/jquery.cookie.pack.js"></script>
		<script type="text/javascript" src="js/jquery.dimensions.min.js"></script>		
        <script type='text/javascript' src='js/jquery.scrollableFixedHeaderTable.js'></script>       
    </head>
    <body>
        <div class='topo'>Motor de busca de dados Linked Data</div>
        <div id="search" class="search" align="center">
            <input type="text" name="busca" id="idBusca" readonly  style="width:80%;">
            <input type="hidden" name="buscaView" id="idBuscaView">
            <button id="btPesquisar">Pesquisar</button>
            <button id="btLimpar">Limpar</button>
        </div>
        <br />
        <div class='nuvem'>
            <div id="tagCloud" align='center' style='margin:0 auto;'></div>
        </div>        
		
		<img src="img/ajax_loading.gif" alt="Loading..." class="oculta ajaxLoad" id="showLoadAjax" width="76" height="68">
        
        <div id="resultado" align="center" style='margin:0 auto;'></div>
    </body>
</html>
<script type="text/javascript">
    $('#btLimpar').click(function(){
        $('#idBusca').val(null);
        $('#idBuscaView').val(null);
    });

    $(function() {
        $.getJSON("componentes/tagcloud.php", function(data) {
            $("<ul>").attr("id", "tagList").appendTo("#tagCloud");
            $.each(data, function(i, val) {
                var li = $("<li>");
                $("<a>").html(val.tag).attr({title:val.tag, href:"javascript:void(0);", prefixo: val.alias}).appendTo(li);
                li.children().css("fontSize", (val.freq / 10 < 1) ? val.freq / 10 + 1 + "em": (val.freq / 10 > 2) ? "2em" : val.freq / 10 + "em");
                li.appendTo("#tagList");

            });
        });
    });

    $('body').delegate('a','click',function(){
        var tag = $(this).text();
		
        var search = $('#idBusca').attr('value');
        if(search == ''){
            search = tag;
        }else{
			var str_search = search.split('+');		
			array_tmp = $.grep(str_search, function(value){
				return value != tag;
			});			
			if(array_tmp.length == str_search.length){
				array_tmp.push(tag);
			}		
			search = array_tmp.join('+');						
        }		
        $('#idBusca').val(search);

		
        var idTag = $(this).attr('prefixo');
        var searchView = $('#idBuscaView').attr('value');
        if(searchView == ''){
            searchView = idTag+':'+tag;
        }else{
			var str_searchView = searchView.split('AND');
			//alert(str_searchView);
			array_tmpView = $.grep(str_searchView, function(value){
				return value != (idTag+':'+tag);
			});			
			if(array_tmpView.length == str_searchView.length){
				array_tmpView.push(idTag+':'+tag);
			}		
			searchView = array_tmpView.join('AND');
			//alert(searchView);
        }        
        $('#idBuscaView').val(searchView);
    });

    $('#btPesquisar').click(function(){
        var button = $('button',this).attr('disabled',true);
        var search = $('#idBuscaView').val();
        $.ajax({
            type: 'POST',
            url: 'componentes/motor.php?search='+search,
            beforeSend: function(){
                $('#showLoadAjax').show();
            },
            success: function(data){
                $('#resultado').html(data);
                $('#showLoadAjax').hide();
                button.attr('disabled',false);
            },
            error: function(txt){
                $('#showLoadAjax').hide();
                alert('erro!!');
            }
        })
    });

</script>