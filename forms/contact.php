<?php
  // 1. Set your receiving email address
  $receiving_email_address = 'ishmam.on@gmail.com';

  // 2. Check if form was submitted
  if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = strip_tags(trim($_POST["name"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $subject = strip_tags(trim($_POST["subject"]));
    $message = trim($_POST["message"]);

    // Basic validation
    if (empty($name) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
      echo "Please complete the form and try again.";
      exit;
    }

    // Prepare Email Content
    $email_content = "Name: $name\n";
    $email_content .= "Email: $email\n\n";
    $email_content .= "Message:\n$message\n";

    // Build Email Headers
    $email_headers = "From: $name <$email>";

    // Send the email
    if (mail($receiving_email_address, $subject, $email_content, $email_headers)) {
      echo "OK"; // Bootstrap templates look for "OK" to show the success message
    } else {
      echo "Oops! Something went wrong and we couldn't send your message.";
    }
  } else {
    echo "There was a problem with your submission, please try again.";
  }
?>
