<?php


header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

$apiUrl = 'https://painel.passofundo.ifsul.edu.br/ws/?ws=professor';

// Tenta usar cURL primeiro
if (function_exists('curl_init')) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200) {
        echo $response;
    } else {
        http_response_code($httpCode);
        echo json_encode(['error' => 'Erro ao carregar dados da API', 'code' => $httpCode]);
    }
} else {
    // Fallback para file_get_contents
    $context = stream_context_create([
        'http' => [
            'method' => 'GET',
            'header' => 'Accept: application/json',
            'timeout' => 30
        ],
        'ssl' => [
            'verify_peer' => false,
            'verify_peer_name' => false
        ]
    ]);
    
    $response = @file_get_contents($apiUrl, false, $context);
    
    if ($response !== false) {
        echo $response;
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Erro ao carregar dados da API']);
    }
}
?>