<?php
$array_tags = array();
$array_tags[] = array("tag"=>'goals','freq'=>75,'alias'=>'dbp');
$array_tags[] = array("tag"=>'placeOfBirth','freq'=>50,'alias'=>'dbp');
$array_tags[] = array("tag"=>'fullname','freq'=>10,'alias'=>'dbp');
$array_tags[] = array("tag"=>'page','freq'=>20,'alias'=>'foaf');
$array_tags[] = array("tag"=>'dateOfBirth','freq'=>80,'alias'=>'dbp');
$array_tags[] = array("tag"=>'Ronaldinho Gaúcho','freq'=>100,'alias'=>'rdfs');
$array_tags[] = array("tag"=>'Pelé','freq'=>100,'alias'=>'rdfs');
$array_tags[] = array("tag"=>'Kaká','freq'=>100,'alias'=>'rdfs');
$array_tags[] = array("tag"=>'Zico','freq'=>100,'alias'=>'rdfs');

$json = json_encode($array_tags);

echo $json;	
?>