<?php
/**
 * Created by PhpStorm.
 * User: songli
 * Date: 1/29/14
 * Time: 9:47 PM
 */

sleep(5);

$urlParts   = preg_split("/\//", $_SERVER["REQUEST_URI"]);
$reqType    = strtoupper($_SERVER["REQUEST_METHOD"]);

//var_dump($urlParts);
//var_dump($reqType);

//this is app engine cloud sql connection
//$db = new mysqli(null, "root", "", null, null, "/cloudsql/august-period-412:form");
//this is the local mysql db connection
$db = new mysqli("localhost", "root", "", "main");
if($db->connect_errorno > 0){
    die('Unable to connect database [' . $db->connect_error . ']');
}

try{
    if(count($urlParts) == 3 && $reqType == "POST" && $urlParts[2] == 'signup'){
        toSignup();
    }else if(count($urlParts) == 3 && $reqType == "POST" && $urlParts[2] == 'login'){
        toLogin();
    }else{
        throw new Exception('WRONG_ACTION');
    }
}catch(Exception $e){
    echo json_encode(array('status'=>'fail', 'id'=>0, 'message'=>$e->getMessage()));
}

$db->close();

function toSignup(){
    global $db;

    $firstName  = $_POST['firstName'];
    $lastName   = $_POST['lastName'];
    $email      = $_POST['email'];
    $password   = $_POST['password'];

    //duplication check
    $query = sprintf("SELECT COUNT(*) AS total FROM user WHERE email='%s'", mysql_real_escape_string($email));
    $result = $db->query($query);
    if($result){
        $numberOfExistingEmail = $result->fetch_object()->total;
        if($numberOfExistingEmail > 0){
            throw new Exception('EMAIL_DUP');
        }
    }

    //create the new user
    $query = sprintf("INSERT INTO user (firstName, lastName, email, password) values ('%s', '%s', '%s', '%s')",
                        mysql_real_escape_string($firstName),
                        mysql_real_escape_string($lastName),
                        mysql_real_escape_string($email),
                        mysql_real_escape_string($password));
    $db->query($query);
    echo json_encode(array('status'=>'success', 'id'=>$db->insert_id, 'message'=>''));
}

function toLogin(){
    global $db;

    $email      = $_POST['email'];
    $password   = $_POST['password'];

    //query user information from db
    $query = sprintf("SELECT userId, firstName, lastName, email FROM user WHERE email='%s' AND password='%s'", mysql_real_escape_string($email), mysql_real_escape_string($password));

    if($result = $db->query($query)){
        $user = [];
        while($row = $result->fetch_assoc()){
            //$userId = $row['userId'];
            $user = $row;
        }

        //var_dump($row);

        if(sizeof($user) > 0){
            echo json_encode(array('status'=>'success', 'id'=>0, 'message'=>''));
        }else{
            throw new Exception('LOGIN_FAILED');
        }
    }else{
        throw new Exception('SYSTEM_ERROR');
    }
}