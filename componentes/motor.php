<style type="text/css">
    .tableMaq{
        border-width: 1px;
        border-collapse:collapse;
        border-style:solid;
        width:100%;
        
    }
    .tableMaq th{
        font-weight:bold;
        background-color:#87CEEB;
    }
    .tableMaq td{
        background-color:white;
    }
</style>
 <?php
 include("FirePHPCore/fb.php");
 include("monta_sparql.php");

 $search = $_REQUEST['search'];
 $search = trim($search);

 if(!empty($search)) {
    $sparql = montaSparql($search);
    
    ?>
    <input type="hidden" value="<?php echo $sparql; ?>" id="consultaSparql">
    <div id="resDbpedia" align='center' style='margin:0 auto;'></div>
    <script type="text/javascript">
        $(document).ready(function(){
            var query = $('#consultaSparql').attr('value');

			 $.ajax({
				type: 'GET',
				url: "http://dbpedia.org/sparql?query="+query+"&debug=on&format=text/html",
				beforeSend: function(){
					$('#showLoadAjax').show();
				},
				success: function(data){
					$('#resDbpedia').html(data);
					$('#showLoadAjax').hide();
					$('#resDbpedia table').addClass('tableMaq');
					/* $('#resDbpedia table').addClass('tableMaq scrollableFixedHeaderTable');						
					$('#resDbpedia table').attr('id','tabela1');											
					$('#tabela1').scrollableFixedHeaderTable(800,400);	 */		
				},
				error: function(txt){
					$('#showLoadAjax').hide();
					alert('erro!!');
				}
			})
        });
    </script>
    <?php
 }else {
     ?>
<script type="text/javascript">
    alert("Selecione uma ou mais tags a baixo para realizar a consulta!");
</script>
<?php } ?>