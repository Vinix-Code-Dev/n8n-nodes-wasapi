<div align="center">
  <img src="public/bannerN8n.webp" alt="Wasapi n8n Integration Banner" width="100%"/>
</div>

# 🚀 Official Wasapi Nodes Package for n8n

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![n8n Community](https://img.shields.io/badge/n8n-Community%20Node-brightgreen)](https://n8n.io)

> **The most complete Wasapi integration for n8n** - Connect your WhatsApp API workflows with powerful automation capabilities.

## 🏢 About Wasapi

[Wasapi](https://wasapi.io) is an official WhatsApp Business API platform that acts as a **Meta Business Partner**, providing direct and reliable access to the WhatsApp Business API.

### ✅ Official Verification
- **Meta Business Partner** certified
- **WhatsApp Business API** official provider
- **24/7 Support** for businesses
- **Compliance** with Meta policies

## 📋 Description

This n8n node package provides a complete and robust integration with the Wasapi API, allowing you to fully automate your WhatsApp workflows. With over 20 implemented operations, it covers all main Wasapi functionalities, from contact management to message and template sending.

### ✨ Key Features

- 🔄 **Complete Integration**: All Wasapi operations available
- 📱 **WhatsApp Business API**: Full support for messaging and templates
- 👥 **Contact Management**: Complete CRUD with custom fields and labels
- 🤖 **Agent Automation**: Agent assignment and management
- 📊 **Templates and Flows**: WhatsApp template and flow sending
- 🛡️ **Robust Validation**: Integrated validators for all data
- 🚀 **Easy to Use**: Intuitive interface and complete documentation

## 🚀 Installation

### Option 1: Install from npm (Recommended)
```bash
npm install @wasapi/n8n-nodes-wasapi@latest
```

### Option 2: Manual Installation
1. Clone this repository
2. Install dependencies: `npm install`
3. Build the project: `npm run build`
4. Copy the `dist` folder to your n8n installation

### Configuration
1. In n8n, go to **Settings** > **Community Nodes**
2. Click **Install a community node**
3. Search for `@wasapi/n8n-nodes-wasapi@latest` or install from npm
4. Configure your Wasapi credentials in the node

## 📖 Usage Examples

### Basic Contact Creation
```json
{
  "name": "John Doe",
  "phone": "+1234567890",
  "email": "john@example.com"
}
```

### Send WhatsApp Message
```json
{
  "to": "+1234567890",
  "message": "Hello from n8n!",
  "type": "text"
}
```

### Send Template Message
```json
{
  "to": "+1234567890",
  "template": "welcome_template",
  "parameters": ["John", "12345"]
}
```

## 🔧 Available Operations

### Contact Management
- Create Contact
- Update Contact
- Delete Contact
- Get Contact
- List Contacts
- Add Custom Fields
- Add Labels

### WhatsApp Operations
- Send Message
- Send Template
- Send Flow
- Get Templates
- Get Flows

### Agent Management
- List Agents
- Assign Agent
- Get Agent

### Campaign Management
- Create Campaign
- List Campaigns
- Get Campaign

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [n8n Documentation](https://docs.n8n.io/)
- **Issues**: [GitHub Issues](https://github.com/Vinix-Code-Dev/n8n-nodes-wasapi/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Vinix-Code-Dev/n8n-nodes-wasapi/discussions)
- **Wasapi Support**: [Wasapi Help Center](https://help.wasapi.com/)

## 🙏 Acknowledgments

- [n8n](https://n8n.io/) team for the incredible automation platform
- [Wasapi](https://wasapi.io) for providing their WhatsApp API wrapper
- All contributors and community members

---

<div align="center">

**⭐ Give this repository a star if you find it useful! ⭐**

Developed with ❤️ by **[Juan Alvarez](https://juanalvarez.pro)**

[![n8n](https://img.shields.io/badge/n8n-Community%20Node-brightgreen)](https://n8n.io)
[![Wasapi](https://img.shields.io/badge/Wasapi-API%20Integration-blue)](https://wasapi.io)
[![Developer](https://img.shields.io/badge/Developer-Juan%20Alvarez-purple)](https://juanalvarez.pro)

</div>
