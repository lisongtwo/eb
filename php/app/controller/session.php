<?php
/**
 * Created by PhpStorm.
 * User: songli
 * Date: 1/29/14
 * Time: 9:47 PM
 */

$urlParts   = preg_split("/\//", $_ENV["REQUEST_URI"]);
$reqType    = strtoupper($_ENV["REQUEST_METHOD"]);


var_dump($urlParts);
var_dump($reqType);

if(count($urlParts) == 3 && $reqType == "POST"){
    if($urlParts[2] == "signup"){
        echo "to signup";
    }elseif($urlParts[2] == "login"){
        echo "to login";
    }else{
        echo "wrong action type in /session";
    }
}else{
    echo "wrong parameter in /session";
}