@ -0,0 +1,52 @@
message = """
<html lang="es">
<head>
    <style>
        body {{
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333333;
            text-align: center;
            padding: 20px;
        }}
        .container {{
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        }}
        h2 {{
            color: #4CAF50;
        }}
        .token {{
            font-size: 24px;
            font-weight: bold;
            color: #333333;
            background-color: #f0f0f0;
            padding: 10px;
            border-radius: 5px;
            display: inline-block;
            margin-top: 10px;
        }}
        .footer {{
            margin-top: 20px;
            font-size: 12px;
            color: #666666;
        }}
    </style>
</head>
<body>
    <div class="container">
        <h2>Verificación de Código</h2>
        <p>Estimado {username}, el siguiente código es para verificar tu cuenta o completar el proceso:</p>
        <div class="token">{token}</div>
        <p class="footer">Si no solicitaste esta verificación, ignora este mensaje.</p>
    </div>
</body>
</html>
"""

def return_message(username, token):
    return message.format(username=username, token=token)
