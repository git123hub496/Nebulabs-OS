
"use client"

import React, { useState } from 'react';
import { useOS } from '@/context/os-context';
import { 
  Laptop, 
  Smartphone, 
  Cpu, 
  Glasses, 
  Server, 
  ArrowRight, 
  CheckCircle2, 
  Star, 
  Zap, 
  Shield, 
  ShieldCheck,
  Package, 
  Clock, 
  CreditCard,
  X,
  Plus,
  Minus,
  ShoppingBag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  category: 'laptop' | 'mobile' | 'desktop' | 'gear';
  price: number;
  description: string;
  specs: string[];
  image: string;
  isNew?: boolean;
  rating: number;
}

const PRODUCTS: Product[] = [
  {
    id: 'nb-pro-x',
    name: 'NebulaBook Pro X',
    category: 'laptop',
    price: 2499,
    description: 'The ultimate quantum-threaded mobile workstation. Built for creators and developers.',
    specs: ['Quantum-X Octa-Core', '64GB LPDDR5', '2TB SSD', '16" Liquid Nebula Display'],
    image: 'https://picsum.photos/seed/nbprox/600/400',
    isNew: true,
    rating: 5.0
  },
  {
    id: 'nphone-13',
    name: 'NebulaPhone 13 Ultra',
    category: 'mobile',
    price: 1199,
    description: 'Holographic imaging meets neural connectivity. The future of mobile is here.',
    specs: ['Neural Link v4', 'Holographic OLED', 'Quantum Night Vision', 'All-Week Battery'],
    image: 'https://picsum.photos/seed/nphone/600/400',
    isNew: true,
    rating: 4.9
  },
  {
    id: 'npc-titan',
    name: 'Nebula-PC Titan',
    category: 'desktop',
    price: 4999,
    description: 'Extreme compute for AI researchers and deep-sim enthusiasts.',
    specs: ['Dual Quantum-X Ultra', '256GB RAM', '10TB RAID-0', 'Liquid Nitrogen Cooling'],
    image: 'https://picsum.photos/seed/npc/600/400',
    rating: 5.0
  },
  {
    id: 'nglass',
    name: 'Nebula Vision Glasses',
    category: 'gear',
    price: 799,
    description: 'Augmented reality seamlessly integrated with your workspace.',
    specs: ['8K Per Eye', 'Direct Kernel Link', 'Bone Conduction Audio', '12h Runtime'],
    image: 'https://picsum.photos/seed/nglasses/600/400',
    isNew: true,
    rating: 4.8
  },
  {
    id: 'nnode',
    name: 'Nebula Server Node',
    category: 'desktop',
    price: 1599,
    description: 'Host your own cloud partition with military-grade encryption.',
    specs: ['128-Core Compute', 'Self-Healing Storage', 'Uninterruptible UPS', 'Global DNS Link'],
    image: 'https://picsum.photos/seed/nnode/600/400',
    rating: 4.7
  },
  {
    id: 'nb-air',
    name: 'NebulaBook Air',
    category: 'laptop',
    price: 1299,
    description: 'Impossible thinness. Unmatched performance. The traveler\'s companion.',
    specs: ['Quantum-X Nano', '16GB RAM', '512GB SSD', '13" Nano-Bezel Display'],
    image: 'https://picsum.photos/seed/nbair/600/400',
    rating: 4.9
  }
];

export const ShopNebulabs: React.FC = () => {
  const { addNotification, playSound } = useOS();
  const [filter, setFilter] = useState<'all' | Product['category']>('all');
  const [selectedProduct, setSelectedAccount] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const filteredProducts = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);

  const handleBuy = (product: Product) => {
    setSelectedAccount(product);
    setIsCheckoutOpen(true);
    playSound('click');
  };

  const completePurchase = () => {
    if (!selectedProduct) return;
    setIsPurchasing(true);
    setTimeout(() => {
      setIsPurchasing(false);
      setIsCheckoutOpen(false);
      addNotification(
        "Order Confirmed", 
        `Your ${selectedProduct.name} is being prepared for delivery. Check your NebulaMail for tracking.`, 
        'app'
      );
      playSound('notify');
      setSelectedAccount(null);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0f14] overflow-hidden">
      {/* Hero Header */}
      <div className="p-8 bg-gradient-to-br from-accent/20 to-primary/40 shrink-0 border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <ShoppingBag size={200} className="text-white" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-lg border border-accent/40">
              <Package className="text-white" size={24} />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">Shop Nebulabs</h1>
          </div>
          <p className="text-white/60 max-w-md font-medium text-sm">Hardware for the next generation of digital pioneers. Built by Nebulabs, owned by you.</p>
        </div>

        {/* Filter Navigation */}
        <div className="flex gap-2 mt-8 relative z-10">
          {[
            { id: 'all', label: 'All Tech', icon: Package },
            { id: 'laptop', label: 'NebulaBooks', icon: Laptop },
            { id: 'mobile', label: 'Phones', icon: Smartphone },
            { id: 'desktop', label: 'PCs & Nodes', icon: Cpu },
            { id: 'gear', label: 'Gear', icon: Glasses },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id as any)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all border",
                filter === cat.id 
                  ? "bg-white text-black border-white shadow-xl shadow-white/10 scale-105" 
                  : "bg-white/5 text-white/40 border-white/5 hover:bg-white/10 hover:text-white"
              )}
            >
              <cat.icon size={14} />
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <ScrollArea className="flex-1 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
          {filteredProducts.map(product => (
            <div 
              key={product.id}
              className="group bg-white/5 border border-white/5 rounded-[2rem] overflow-hidden flex flex-col hover:border-accent/40 transition-all hover:bg-white/[0.07] shadow-2xl"
            >
              <div className="aspect-[4/3] relative overflow-hidden bg-black/40">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" 
                />
                {product.isNew && (
                  <Badge className="absolute top-4 left-4 bg-accent text-white font-black uppercase text-[10px] tracking-widest border-none px-3">NEW RELEASE</Badge>
                )}
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md rounded-xl px-3 py-1 text-white font-mono font-bold text-sm border border-white/10">
                  ${product.price}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={10} className={cn(i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-white/10")} />
                    ))}
                    <span className="text-[10px] text-white/40 font-bold ml-1">{product.rating}</span>
                  </div>
                  <h3 className="text-xl font-black text-white leading-none tracking-tight">{product.name}</h3>
                  <p className="text-xs text-white/40 line-clamp-2 leading-relaxed font-medium">{product.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {product.specs.map((spec, i) => (
                    <div key={i} className="flex items-center gap-2 text-[10px] text-white/60 font-bold bg-white/5 rounded-lg p-2 border border-white/5">
                      <Zap size={10} className="text-accent shrink-0" />
                      <span className="truncate">{spec}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  onClick={() => handleBuy(product)}
                  className="w-full mt-auto bg-accent text-primary-foreground font-black uppercase tracking-[0.2em] h-12 rounded-2xl hover:scale-[1.02] transition-transform shadow-lg shadow-accent/20"
                >
                  Configure & Buy
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Checkout Modal */}
      {isCheckoutOpen && selectedProduct && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-8 animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-[#161d25] border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center text-accent">
                  <CreditCard size={20} />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tighter text-white">Checkout</h2>
              </div>
              <button onClick={() => setIsCheckoutOpen(false)} className="text-white/20 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-8">
              <div className="flex gap-6 items-start">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-black/40 shrink-0">
                  <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-black text-white">{selectedProduct.name}</h3>
                  <p className="text-xs text-white/40 leading-relaxed font-medium">{selectedProduct.description}</p>
                  <p className="text-lg font-mono text-accent font-black pt-2">${selectedProduct.price}.00</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <Shield className="text-green-500" size={18} />
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/80">NebulaCare+ Protection</p>
                      <p className="text-[9px] text-white/40">Includes accidental damage & theft protection.</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-500 font-bold">ACTIVE</Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <Clock className="text-blue-400" size={18} />
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/80">Priority Staging</p>
                      <p className="text-[9px] text-white/40">Next-day delivery via Nebula Drone Link.</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 font-bold">FREE</Badge>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Total Investment</span>
                  <span className="text-2xl font-black text-white tracking-tighter">${selectedProduct.price}.00</span>
                </div>

                <Button 
                  onClick={completePurchase}
                  disabled={isPurchasing}
                  className="w-full h-16 bg-white text-black hover:bg-white/90 font-black uppercase tracking-[0.3em] rounded-2xl text-lg shadow-2xl shadow-white/5"
                >
                  {isPurchasing ? (
                    <div className="flex items-center gap-3">
                      <RefreshCw className="animate-spin" size={20} />
                      Authorizing...
                    </div>
                  ) : (
                    "Authorize Transaction"
                  )}
                </Button>
                <div className="flex items-center justify-center gap-2 mt-4 opacity-40">
                  <ShieldCheck size={12} className="text-accent" />
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white">Quantum Encrypted Gateway</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 bg-black/40 border-t border-white/5 text-center flex items-center justify-center gap-8">
        <div className="flex items-center gap-2">
          <ShieldCheck size={12} className="text-accent" />
          <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Official Hardware Outlet</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 size={12} className="text-green-500" />
          <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Stock Guaranteed</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap size={12} className="text-yellow-400" />
          <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Priority Staging</span>
        </div>
      </div>
    </div>
  );
};
