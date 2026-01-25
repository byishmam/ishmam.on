<?php
  // 1. Set your receiving email address
  $receiving_email_address = 'ishmam.on@gmail.com';

  // 2. Simple check for POST request
  if ($_SERVER["REQUEST_METHOD"] == "POST") {
      $name = strip_tags(trim($_POST['name']));
      $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
      $subject = strip_tags(trim($_POST['subject']));
      $message = trim($_POST['message']);

      // Basic validation
      if (empty($name) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
          http_response_code(400);
          echo "Please complete the form and try again.";
          exit;
      }

      // Email content
      $email_content = "Name: $name\nEmail: $email\n\nSubject: $subject\n\nMessage:\n$message";
      $headers = "From: $name <$email>";

      // Send the email
      if (mail($receiving_email_address, $subject, $email_content, $headers)) {
          // Templates usually look for the string "OK" to show the success message
          echo "OK";
      } else {
          http_response_code(500);
          echo "Oops! Something went wrong and we couldn't send your message.";
      }
  } else {
      http_response_code(403);
      echo "There was a problem with your submission, please try again.";
  }
?>
