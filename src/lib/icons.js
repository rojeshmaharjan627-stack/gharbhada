import {
  MapPin,
  Search,
  Layers,
  SlidersHorizontal,
  Flame,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Droplet,
  Shield,
  ShieldCheck,
  Sun,
  Wifi,
  ExternalLink,
  MessageCircle,
  Phone,
  PhoneCall,
  Plus,
  PlusCircle,
  User,
  Building,
  LogOut,
  Edit,
  Share2,
  UploadCloud,
  Send,
  X,
  Home,
  Bed,
  Bath,
  Handshake,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Headphones,
  Trash2,
  RotateCcw,
  AlertTriangle,
  Circle,
  LayoutGrid
} from 'lucide';

const iconMap = {
  MapPin,
  Search,
  Layers,
  SlidersHorizontal,
  Flame,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Droplet,
  Shield,
  ShieldCheck,
  Sun,
  Wifi,
  ExternalLink,
  MessageCircle,
  Phone,
  PhoneCall,
  Plus,
  PlusCircle,
  User,
  Building,
  LogOut,
  Edit,
  Share2,
  UploadCloud,
  Send,
  X,
  Home,
  Bed,
  Bath,
  Handshake,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Headphones,
  Trash2,
  RotateCcw,
  AlertTriangle,
  Circle,
  LayoutGrid
};

function toPascalCase(str) {
  if (!str) return 'Circle';
  return str
    .replace(/[-_ ]+(.)/g, (_, c) => c.toUpperCase())
    .replace(/^(.)/, c => c.toUpperCase());
}

/**
 * Returns an inline SVG string for the specified Lucide icon name.
 * Ultra-lightweight and tree-shakeable for optimal mobile bandwidth in Nepal.
 */
export function getIcon(name, { class: className = 'w-4 h-4', size = 16, strokeWidth = 2 } = {}) {
  const iconKey = toPascalCase(name);
  const iconNode = iconMap[iconKey] || iconMap[name] || Circle;
  if (!Array.isArray(iconNode)) {
    return `<span class="${className}"></span>`;
  }

  const inner = iconNode
    .map(([tag, attrs]) => {
      const attrStr = Object.entries(attrs)
        .map(([k, v]) => `${k}="${v}"`)
        .join(' ');
      return `<${tag} ${attrStr}></${tag}>`;
    })
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" class="${className} inline-block shrink-0 align-middle">${inner}</svg>`;
}
