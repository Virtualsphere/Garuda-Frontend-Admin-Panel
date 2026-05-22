import React, { useState } from 'react';
import { TrendingUp, Lock, Filter, Eye, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('registry');

  const missionFeeData = [
    { label: 'REGISTRY SYNC', value: '₹25.5K', status: 'DONE', statusColor: 'text-green-500' },
    { label: 'BUYER AUDIT', value: '₹32.7K', status: 'WAIT', statusColor: 'text-orange-500' },
    { label: 'ALLOTMENT', value: '₹40.2K', status: 'DONE', statusColor: 'text-green-500' },
    { label: 'MAPPING', value: '₹50.2K', status: 'ACTIVE', statusColor: 'text-blue-500' },
    { label: 'VERIFICATION', value: '₹15.9K', status: 'DONE', statusColor: 'text-green-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* Header Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
              Administrator Workspace
            </h1>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
              REGISTRY SYNCHRONIZED · CORE V4.2
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors">
              <Lock size={18} />
              <span className="text-sm font-medium">UNLOCK TO EDIT</span>
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-white font-bold">
              AC
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="col-span-2 space-y-8">
          {/* Portfolio Valuation */}
          <div>
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">
              Portfolio Valuation
            </h2>
            <div className="relative">
              <div className="text-5xl font-black text-slate-900 mb-2 tracking-tight">
                ₹45.68 Cr
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full flex items-center gap-1">
                  <TrendingUp size={14} />
                  +15%
                </span>
                <span className="text-xs text-slate-500 font-medium">YoY/W</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold transition-colors shadow-lg hover:shadow-xl">
              <span className="text-lg">+</span>
              Add Land
            </button>
            <button className="px-6 py-3 bg-white border border-slate-200 text-slate-900 rounded-lg font-bold hover:bg-slate-50 transition-colors">
              Request Audit
            </button>
          </div>

          {/* District Wallets */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                District Wallets
              </h2>
              <span className="text-xs text-slate-400 font-medium">8 Active Nodes</span>
            </div>
            
            <div className="space-y-3">
              {/* Wallet 1 - Orange */}
              <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs font-bold opacity-90 uppercase tracking-wider mb-1">Maharajgodly</p>
                    <p className="text-3xl font-black">₹22.6L</p>
                  </div>
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                    <span className="text-xl">🔸</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider">ACTIVE</span>
                  <span className="text-xs font-bold text-green-200">+8%</span>
                </div>
              </div>

              {/* Wallet 2 - Blue */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs font-bold opacity-90 uppercase tracking-wider mb-1">Medinal</p>
                    <p className="text-3xl font-black">₹18.3L</p>
                  </div>
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                    <span className="text-xl">🔵</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider">ACTIVE</span>
                  <span className="text-xs font-bold text-green-200">+5%</span>
                </div>
              </div>

              {/* Wallet 3 - Gray */}
              <div className="bg-gradient-to-br from-slate-300 to-slate-400 rounded-2xl p-6 text-slate-700 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs font-bold opacity-80 uppercase tracking-wider mb-1">Maharajsindol</p>
                    <p className="text-3xl font-black">₹15.0L</p>
                  </div>
                  <div className="w-12 h-12 bg-white bg-opacity-30 rounded-xl flex items-center justify-center">
                    <span className="text-xl">⚪</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider">INACTIVE</span>
                  <span className="text-xs font-bold opacity-60">—</span>
                </div>
              </div>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Sources Card - Orange */}
            <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-3xl p-8 text-white shadow-lg hover:shadow-xl transition-shadow">
              <p className="text-xs font-bold opacity-90 uppercase tracking-wider mb-2">Sources</p>
              <p className="text-4xl font-black mb-2">₹950L</p>
              <div className="text-xs font-bold opacity-80">+7% vs last week</div>
            </div>

            {/* Leads Card - Blue */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-8 text-white shadow-lg hover:shadow-xl transition-shadow">
              <p className="text-xs font-bold opacity-90 uppercase tracking-wider mb-2">Leads</p>
              <p className="text-4xl font-black mb-2">₹700L</p>
              <div className="text-xs font-bold opacity-80">
                <span className="inline-block w-3 h-3 rounded-full bg-blue-300 mr-2"></span>
                Verify
              </div>
            </div>

            {/* Active Card - Green */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-8 text-white shadow-lg hover:shadow-xl transition-shadow">
              <p className="text-xs font-bold opacity-90 uppercase tracking-wider mb-2">Active</p>
              <p className="text-4xl font-black mb-2">₹1,050L</p>
              <div className="text-xs font-bold opacity-80">+8% vs previous</div>
            </div>

            {/* Revenue Card - Dark */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 text-white shadow-lg hover:shadow-xl transition-shadow">
              <p className="text-xs font-bold opacity-90 uppercase tracking-wider mb-2">Revenue</p>
              <p className="text-4xl font-black mb-2">₹850L</p>
              <div className="text-xs font-bold opacity-80">+5% vs target</div>
            </div>
          </div>

          {/* Mission Load */}
          <div>
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">
              Mission Load
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-orange-500 h-2 rounded-full" style={{ width: '36%' }}></div>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                <span>1,400 VERIFIED</span>
                <span>5,500 TARGET</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Mission Fee */}
        <div className="col-span-1">
          <div className="sticky top-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Mission Fee
              </h2>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                  <Eye size={18} className="text-slate-600" />
                </button>
                <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                  <Filter size={18} className="text-slate-600" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {missionFeeData.map((item, index) => (
                <div key={index} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow border border-slate-100">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">
                        {item.label}
                      </p>
                      <p className="text-2xl font-black text-slate-900">{item.value}</p>
                    </div>
                    <span className={`text-xs font-bold uppercase tracking-widest ${item.statusColor}`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        item.status === 'DONE' ? 'bg-green-500' :
                        item.status === 'WAIT' ? 'bg-orange-500' :
                        'bg-blue-500'
                      }`}
                      style={{ width: `${60 + index * 10}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 text-center py-3 text-sm font-bold text-slate-600 hover:text-slate-900 uppercase tracking-wider transition-colors">
              View All <ArrowRight className="inline-block ml-2" size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}