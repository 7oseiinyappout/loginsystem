import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:flutter/services.dart';
import 'dart:async';
import 'login.dart';
import 'signup.dart';
import 'clipboard.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:web_socket_channel/web_socket_channel.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;

void main() {
  // Override RawKeyboard behavior to prevent crashes
  RawKeyboard.instance.addListener((RawKeyEvent event) {
    if (event is RawKeyDownEvent && RawKeyboard.instance.keysPressed.isEmpty) {
      // Ignore invalid key down events
      return;
    }
  });

  WidgetsFlutterBinding.ensureInitialized();
  runApp(const MyApp());
  startClipboardMonitoring();
}

void startClipboardMonitoring() {
  String? lastClipboardContent;
  bool isProcessing = false; // Flag to prevent multiple simultaneous requests

  Timer.periodic(const Duration(milliseconds: 500), (timer) async {
    if (isProcessing) return; // Skip if a request is already in progress

    try {
      final clipboardData = await Clipboard.getData('text/plain');
      if (clipboardData != null && clipboardData.text != null) {
        final newContent = clipboardData.text!.trim();
        if (newContent.isNotEmpty && newContent != lastClipboardContent) {
          lastClipboardContent = newContent;
          isProcessing =
              true; // Set the flag to true before starting the request
          await saveClipboardContent(newContent);
          isProcessing = false; // Reset the flag after the request is complete
        }
      } else {
        isProcessing = false; // Reset the flag if clipboard is empty
      }
    } catch (e) {
      print('Error accessing clipboard: $e');
      isProcessing = false; // Reset the flag in case of an error
    }
  });
}

Future<void> saveClipboardContent(String text) async {
  final prefs = await SharedPreferences.getInstance();
  final token = prefs.getString('token');
  if (token == null) return;

  final response = await http.post(
    Uri.parse(
        'https://loginsystem-production-9118.up.railway.app/api/clipboard'),
    headers: {
      'Authorization': 'Bearer $token',
      'Content-Type': 'application/json'
    },
    body: jsonEncode({'content': text, 'type': 'text'}),
  );

  if (response.statusCode == 200) {
    print('Clipboard content saved successfully');
  } else {
    print('Failed to save clipboard content: ${response.body}');
  }
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Login System',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => const HomePage(),
        '/login': (context) => const LoginPage(),
        '/signup': (context) => const SignupPage(),
        '/clipboard': (context) => const ClipboardPage(),
        '/url_launcher': (context) => const UrlLauncherPage(),
        '/clipboard_monitor': (context) => const ClipboardMonitor(),
        '/clipboard_watcher_test': (context) => const ClipboardWatcherTest(),
        '/websocket_demo': (context) => const WebSocketDemo(),
      },
    );
  }
}

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Home Page'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton(
              onPressed: () => Navigator.pushNamed(context, '/login'),
              child: const Text('Login'),
            ),
            ElevatedButton(
              onPressed: () => Navigator.pushNamed(context, '/signup'),
              child: const Text('Signup'),
            ),
            ElevatedButton(
              onPressed: () => Navigator.pushNamed(context, '/url_launcher'),
              child: const Text('Launch URL Page'),
            ),
            ElevatedButton(
              onPressed: () =>
                  Navigator.pushNamed(context, '/clipboard_monitor'),
              child: const Text('Clipboard Monitor'),
            ),
            ElevatedButton(
              onPressed: () =>
                  Navigator.pushNamed(context, '/clipboard_watcher_test'),
              child: const Text('Clipboard Watcher Test'),
            ),
            ElevatedButton(
              onPressed: () => Navigator.pushNamed(context, '/websocket_demo'),
              child: const Text('WebSocket Demo'),
            ),
          ],
        ),
      ),
    );
  }
}

class UrlLauncherPage extends StatelessWidget {
  const UrlLauncherPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('URL Launcher Test')),
      body: Center(
        child: ElevatedButton(
          onPressed: () async {
            const url = 'https://flutter.dev';
            if (await canLaunch(url)) {
              await launch(url);
            } else {
              throw 'Could not launch $url';
            }
          },
          child: const Text('Launch URL'),
        ),
      ),
    );
  }
}

class ClipboardMonitor extends StatefulWidget {
  const ClipboardMonitor({super.key});

  @override
  State<ClipboardMonitor> createState() => _ClipboardMonitorState();
}

class _ClipboardMonitorState extends State<ClipboardMonitor> {
  String _lastCopiedText = '';

  @override
  void initState() {
    super.initState();
    print('Clipboard monitoring started');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Clipboard Monitor'),
      ),
      body: Center(
        child: Text(
          'Last copied text: $_lastCopiedText',
          style: const TextStyle(fontSize: 16),
        ),
      ),
    );
  }
}

class ClipboardWatcherTest extends StatelessWidget {
  const ClipboardWatcherTest({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Clipboard Watcher Test')),
      body: Center(
        child: ElevatedButton(
          onPressed: () async {
            print('Clipboard Watcher started');
          },
          child: const Text('Start Clipboard Watcher'),
        ),
      ),
    );
  }
}

class WebSocketDemo extends StatefulWidget {
  const WebSocketDemo({super.key});

  @override
  _WebSocketDemoState createState() => _WebSocketDemoState();
}

class _WebSocketDemoState extends State<WebSocketDemo> {
  late IO.Socket socket;

  @override
  void initState() {
    super.initState();
    _initializeSocket();
  }

  Future<void> _initializeSocket() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    if (token == null) {
      print('No token found');
      return;
    }

    final decoded = jsonDecode(
      utf8.decode(base64.decode(base64.normalize(token.split('.')[1]))),
    );
    final userId = decoded['_id'];

    // Initialize Socket.IO connection
    socket = IO.io(
        'https://loginsystem-production-9118.up.railway.app', <String, dynamic>{
      'transports': ['websocket'],
      'query': {'userId': userId},
    });

    socket.on('connect', (_) {
      print('Connected to WebSocket');
      socket.emit('join', userId);
    });

    socket.on('notification', (clip) {
      print('📢 New clipboard received: $clip');
      showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            title: const Text('Clipboard Saved!'),
            content: Text('📢 New clipboard received: $clip'),
            actions: [
              TextButton(
                onPressed: () {
                  Navigator.of(context).pop();
                },
                child: const Text('OK'),
              ),
            ],
          );
        },
      );
    });

    socket.on('disconnect', (_) => print('Disconnected from WebSocket'));
  }

  @override
  void dispose() {
    socket.disconnect();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('WebSocket Demo'),
      ),
      body: Center(
        child: Text('Listening for clipboard notifications...'),
      ),
    );
  }
}
