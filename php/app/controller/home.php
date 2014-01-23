<?php

require_once '../../lib/Twig/Autoloader.php';
Twig_Autoloader::register();

$loader = new Twig_Loader_Filesystem('../view');
$twig = new Twig_Environment($loader, array(
//    'cache' => '../../sys/cache',
));

$template = $twig->loadTemplate('home.html');
echo $template->render(array());