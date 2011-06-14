<?php
$link = mysql_connect('localhost' , 'root', '3259475' );
if (!$link ) { 
	die('Não foi possível conectar: ' . mysql_error());
} else{
    mysql_select_db('tcc');
}
?>