<?php
header('Content-Type: application/json');

$response = ['success' => false];

if (isset($_FILES['image'])) {
    $targetDir = 'uploads/';
    if (!file_exists($targetDir)) {
        mkdir($targetDir, 0777, true);
    }

    $fileName = basename($_FILES['image']['name']);
    $targetFilePath = $targetDir . $fileName;
    $fileType = pathinfo($targetFilePath, PATHINFO_EXTENSION);

    $allowTypes = ['jpg', 'png', 'jpeg', 'gif'];
    if (in_array($fileType, $allowTypes)) {
        if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFilePath)) {
            $response['success'] = true;
            $response['url'] = '/' . $targetFilePath;
        } else {
            $response['error'] = 'Error uploading file.';
        }
    } else {
        $response['error'] = 'Only JPG, JPEG, PNG, & GIF files are allowed.';
    }
} else {
    $response['error'] = 'No image file uploaded.';
}

echo json_encode($response);
?>
