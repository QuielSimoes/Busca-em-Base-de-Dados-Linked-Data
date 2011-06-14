<?php
function montaSparql($propriedades){
    $prefixos = array(
        'dbp'=>'PREFIX%20dbp:%3Chttp://dbpedia.org/property/%3E',
        'foaf'=>'PREFIX%20foaf:%3Chttp://xmlns.com/foaf/0.1/%3E'
    );
   //echo "<http://dbpedia.org/property/>";die();
    $tagProperty = explode('AND',$propriedades);
    //print_r($tagProperty);
    $sparql = '';
    
    $sparql_temp = "SELECT * WHERE { ";
    $vars = '';
    $prefix_temp = array();
    foreach($tagProperty as $key => $value){
        $tagPrefix = explode(':',$value);
        $alias = $tagPrefix[0];
        if($alias == 'rdfs'){
            $value = "rdfs:label";
            $nome = $tagPrefix[1];
            $varName = "'".$nome."'@pt";            
        }else{                        
            if(!in_array($alias,$prefix_temp)){
                $prefix_temp[] = $alias;
                //print_r($prefix_temp);
                $vocabulario = $prefixos[$alias];
                $sparql .= $vocabulario." ";
            }
            $varName = "?".$tagPrefix[1];
        }
        $vars .= "?var ".$value." ".$varName.". ";
    }
    $sparql_temp .= $vars;
    $sparql_temp .= "}";
    $sparql .= $sparql_temp;
    return $sparql;
}
?>