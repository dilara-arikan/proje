# Robot Control & Chat Interface (C# WPF)

## Overview
Masaüstü tabanlı robot kontrol ve gerçek zamanlı sohbet arayüzü. ROS2 + C# üzerinde çalışan, QR kod taraması ve otonom görev yönetimi sağlar.

## Teknoloji Stack
- **Desktop UI**: WPF (.NET 8.0-windows)
- **Robot Bağlantı**: ROS2 + rcldotnet (C# DDS client)
- **QR Taraması**: OpenCvSharp4
- **Logging**: Microsoft.Extensions.Logging
- **Security**: SROS2 (ROS2 DDS Security)

## Mimarı
```
RobotChatUI/
├── App.xaml / App.xaml.cs                  # WPF Application
├── MainWindow.xaml / MainWindow.xaml.cs    # Ana arayüz
├── Models/
│   └── RobotModels.cs                      # Veri modelleri
├── Services/
│   ├── RobotConnectors/
│   │   ├── IRobotConnector.cs              # Bağlantı interface
│   │   └── Ros2Connector.cs                # ROS2 implementasyonu
│   ├── Chat/
│   │   └── ChatService.cs                  # Sohbet yönetimi
│   └── QrDetectionService.cs               # QR algılama
└── RobotChatUI.csproj                      # Proje dosyası
```

## Bağlantı Türleri

### ROS2 (Tercih - Hızlı, DDS)
- rcldotnet ile doğrudan C# ROS2 node
- Telemetri: `/robot/status` topic
- QR Detections: `/qr/detections` topic
- Komutlar: ROS2 Actions/Services
- Güvenlik: SROS2 (mTLS + encryption)

## Veri Modelleri

### QrDetection
```csharp
{
  "id": "UUID",
  "qrCode": "A1",
  "detectedAt": "2026-01-29T12:34:56Z",
  "confidence": 0.95,
  "location": "A1"
}
```

### RobotTelemetry
```csharp
{
  "robotId": "robot-01",
  "x": 2.5,
  "y": 3.0,
  "theta": 45.0,
  "batteryPercentage": 85.0,
  "status": "IDLE",
  "timestamp": "2026-01-29T12:34:56Z"
}
```

### MissionTask
```csharp
{
  "id": "UUID",
  "type": "PICKUP",  // PICKUP, DROP
  "qrId": "A1",
  "sourceLocation": "A1",
  "destinationLocation": "B1",
  "status": "PENDING",  // PENDING, EXECUTING, COMPLETED, FAILED
  "createdAt": "2026-01-29T12:34:56Z"
}
```

## UI Bileşenleri

### Left Panel - Chat
- Gerçek zamanlı mesajlaşma
- QR uyarıları
- Görev durumu güncellemeleri
- Sistem hata/uyarıları

### Middle Panel - Map & QR Scanner
- SLAM harita görselleme
- QR tarama sonuçları
- Konuma dayalı bilgiler

### Right Panel - Control & Status
- Robot telemetrisi (batarya, konum, durum)
- Görev gönderme
- Acil durdurma
- Harita isteği

## QR Akışı

1. **Robottaki QR Taraması (Tercih)**
   - ROS node `/qr/detections` topic yayınlar
   - C# abone olur
   - Chat ve UI'de gösterilir
   - Operatör onaylar → Görev başlatılır

2. **C# tarafında QR Taraması (Alternatif)**
   - C# `/camera/image_raw` aboneliği
   - OpenCvSharp ile tarama
   - Hızı ve CPU etkisini dikkate al

## Güvenlik

### ROS2 DDS Security (SROS2)
- Node-to-node mTLS
- Policy-based access control
- Encryption (AES-256-GCM)

### Uygulama Seviyesi
- HTTPS/TLS tüm ağ iletişimi
- Token-based authentication (JWT)
- Komut şifreleme

### Dosya Güvenliği
- `dotnet user-secrets` ile local config
- Environment variables üzerinden sertifikalar
- Audit logging tüm komutlar

## Hızlı Başlangıç

### Gereksinimler
- .NET 8.0 SDK
- Visual Studio 2022 (veya VS Code + C# extension)
- ROS2 (Humble/Iron) sistemde kurulu
- rcldotnet NuGet paketi

### Kurulum

```bash
# Proje klasörüne git
cd RobotChatUI

# Bağımlılıkları kur
dotnet restore

# ROS2 ortamını ayarla (PowerShell)
$env:ROS_DOMAIN_ID = "0"
$env:RMW_IMPLEMENTATION = "rmw_cyclonedds_cpp"

# Çalıştır
dotnet run
```

### ROS2 Bağlantı Ayarları (Proje içinde)
`RobotConnectionConfig` ile özelleştir:
- `RosDomainId`: ROS_DOMAIN_ID
- `RosNamespace`: Namespace
- `RmwImplementation`: DDS middleware
- `EnableSecurity`: SROS2 etkin mi?
- `SecurityKeyPath`: Sertifikalar

## Komut Geçişi

### Mission Gönderme
```csharp
var task = new MissionTask 
{ 
    Type = "PICKUP",
    QrId = "A1",
    SourceLocation = "A1",
    DestinationLocation = "B1"
};
await _robotConnector.SendMissionAsync(task);
```

### Acil Durdurma
```csharp
await _robotConnector.EmergencyStopAsync();
```

### Harita İsteği
```csharp
await _robotConnector.RequestMapAsync();
```

## Telemetri Aboneliği

```csharp
_robotConnector.TelemetryReceived += (sender, e) =>
{
    var telemetry = e.Telemetry;
    Console.WriteLine($"Robot: {telemetry.X}, {telemetry.Y} | Battery: {telemetry.BatteryPercentage}%");
};

_robotConnector.QrDetectionReceived += (sender, e) =>
{
    Console.WriteLine($"QR Detected: {e.Detection.QrCode} at {e.Detection.Location}");
};
```

## Gelecek Harita
- [ ] Blazor Server + SignalR (web tabanlı alternatif - opsiyonel)
- [ ] TCP/Serial connector fallback
- [ ] Mission replay & history
- [ ] Multi-robot support
- [ ] Advanced SLAM visualization
- [ ] ML-based QR confidence

## Güvenlik Notları

1. **Üretim Ortamında**
   - SROS2 sertifikaları oluştur ve dağıt
   - Ağ segmentasyonu (robot VLAN ayrı)
   - Firewall kuralları ayarla
   - TLS 1.3 zorunlu kıl

2. **Kimlik Doğrulama**
   - ROS2 services için mTLS
   - Operator login JWT token
   - API key rotation

3. **Logging & Audit**
   - Tüm komutlar log'a yazıl
   - Mission complete/fail events kaydedilsin
   - QR detections audit trail

## Sorun Giderme

| Problem | Çözüm |
|---------|-------|
| ROS2 bağlantısı başarısız | ROS kurulu mu? `ROS_DOMAIN_ID` set mi? DDS çalışıyor mu? |
| QR tarama başarısız | Kamera bağlı mı? OpenCV runtime'ı install mi? |
| Hızlı bağlantı değil | DDS QoS profili kontrol et, UDP buffer size artır |
| Chat mesajları gelemedi | Logging kontrol et, event hooklar çalışıyor mu? |

## Lisans
[Proje Lisansı]

## İletişim
- Ekip: [İletişim bilgileri]
- GitHub: [Repo linki]
