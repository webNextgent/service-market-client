import { useState, useRef, useEffect } from "react";
import dirhum from "../../assets/icon/dirhum.png";
import NextBtn from "../NextBtn/NextBtn";
import { useItem } from "../../provider/ItemProvider";

export default function Summary({ 
  total, 
  showInput, 
  setShowInput, 
  vat, 
  subTotal, 
  itemSummary, 
  serviceCharge, 
  address, 
  date, 
  time, 
  serviceTitle, 
  liveAddress 
}) {
    const [promo, setPromo] = useState("");
    const [open, setOpen] = useState(false);
    const scrollContainerRef = useRef(null);
    const { removeItem } = useItem();

    const handleApply = () => {
        if (promo.trim() === "") {
            alert("Please enter a promo code!");
            return;
        }
        setPromo("");
        setShowInput(false);
    };

    return (
        <>
            {/* DESKTOP SUMMARY - COMPACT & SCROLLABLE */}
            <div className="hidden lg:block lg:w-[380px] xl:w-[420px] sticky top-6 self-start">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden h-[calc(100vh-100px)] flex flex-col">
                    {/* Header - Fixed */}
                    <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0">
                        <h2 className="text-lg font-bold text-gray-800">Order Summary</h2>
                        <p className="text-xs text-gray-500 mt-0.5">{itemSummary.length} item{itemSummary.length !== 1 ? 's' : ''}</p>
                    </div>

                    {/* Scrollable Content - Whole Section */}
                    <div 
                        ref={scrollContainerRef}
                        className="flex-1 overflow-y-auto hover:overflow-y-scroll p-4"
                        style={{
                            scrollbarWidth: 'thin',
                            scrollbarColor: '#CBD5E0 #F7FAFC'
                        }}
                    >
                        <style jsx>{`
                            div::-webkit-scrollbar {
                                width: 6px;
                            }
                            div::-webkit-scrollbar-track {
                                background: #F7FAFC;
                                border-radius: 3px;
                            }
                            div::-webkit-scrollbar-thumb {
                                background: #CBD5E0;
                                border-radius: 3px;
                            }
                            div::-webkit-scrollbar-thumb:hover {
                                background: #A0AEC0;
                            }
                        `}</style>

                        <div className="space-y-4">
                            {/* Service Details - Compact */}
                            <div>
                                <h3 className="font-semibold text-gray-700 mb-2 text-xs uppercase tracking-wider">Services</h3>
                                <div className="space-y-2">
                                    {itemSummary.map((item, index) => (
                                        <div
                                            key={index}
                                            className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors border border-gray-200"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-2 flex-1">
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="w-5 h-5 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors text-[10px] mt-0.5 flex-shrink-0"
                                                    >
                                                        ✕
                                                    </button>
                                                    <div className="min-w-0">
                                                        <p className="font-medium text-gray-800 text-sm truncate">
                                                            {item.title}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-0.5 truncate">{serviceTitle[index]}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 font-semibold text-gray-800 flex-shrink-0 ml-2">
                                                    <img src={dirhum} alt="" className="w-3.5 h-3.5" />
                                                    <span className="text-sm">{item.price}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Date & Time - Compact */}
                            {(date || time) && (
                                <div>
                                    <h3 className="font-semibold text-gray-700 mb-2 text-xs uppercase tracking-wider">Schedule</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {date && (
                                            <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                                                <p className="text-[10px] text-gray-500 mb-0.5">Date</p>
                                                <p className="font-medium text-gray-800 text-sm truncate">{date}</p>
                                            </div>
                                        )}
                                        {time && (
                                            <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                                                <p className="text-[10px] text-gray-500 mb-0.5">Time</p>
                                                <p className="font-medium text-gray-800 text-sm truncate">{time}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Address - Compact */}
                            {(liveAddress || (address && address.length > 0)) && (
                                <div>
                                    <h3 className="font-semibold text-gray-700 mb-2 text-xs uppercase tracking-wider">Address</h3>
                                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                        <p className="text-sm text-gray-700 leading-relaxed break-words">{address}</p>
                                    </div>
                                </div>
                            )}

                            {/* Discount Section - Compact */}
                            <div>
                                <h3 className="font-semibold text-gray-700 mb-2 text-xs uppercase tracking-wider">Promo Code</h3>
                                {!showInput ? (
                                    <button
                                        onClick={() => setShowInput(true)}
                                        className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#01788E] hover:text-[#01788E] transition-colors text-sm"
                                    >
                                        + Add Promo Code
                                    </button>
                                ) : (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={promo}
                                            onChange={(e) => setPromo(e.target.value)}
                                            placeholder="Enter promo code"
                                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[#01788E] focus:border-transparent outline-none"
                                        />
                                        <button
                                            onClick={handleApply}
                                            className="bg-[#01788E] text-white px-4 py-2 rounded-lg hover:bg-[#016a7a] transition-colors text-sm"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Price Breakdown - Now inside scrollable area */}
                            <div className="border-t border-gray-200 pt-4 mt-2">
                                <h3 className="font-semibold text-gray-700 mb-3 text-xs uppercase tracking-wider">Price Details</h3>
                                
                                <div className="space-y-2 mb-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Subtotal</span>
                                        <span className="flex items-center gap-1 font-medium text-sm">
                                            <img src={dirhum} className="w-3.5 h-3.5" alt="currency" />
                                            {subTotal}
                                        </span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Service Charge</span>
                                        <span className="flex items-center gap-1 font-medium text-sm">
                                            <img src={dirhum} className="w-3.5 h-3.5" alt="currency" />
                                            {serviceCharge}
                                        </span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">VAT (5%)</span>
                                        <span className="flex items-center gap-1 font-medium text-sm">
                                            <img src={dirhum} className="w-3.5 h-3.5" alt="currency" />
                                            {vat.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-gray-300 my-3"></div>

                                {/* Total */}
                                <div className="flex justify-between items-center bg-gray-50 rounded-lg p-3 border border-gray-200">
                                    <div>
                                        <p className="font-semibold text-gray-800">Total Amount</p>
                                        <p className="text-xs text-gray-500">Including all charges</p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <img src={dirhum} className="w-5 h-5" alt="currency" />
                                        <span className="text-xl font-bold text-gray-800">{total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MOBILE BOTTOM BAR - Compact */}
            <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.08)] border-t border-gray-200 px-3 py-2 flex items-center justify-between z-40">
                <div onClick={() => setOpen(true)} className="cursor-pointer select-none">
                    <p className="text-[10px] text-gray-500">View Summary</p>
                    <p className="text-base font-bold flex items-center gap-1 text-gray-800">
                        <img src={dirhum} className="w-3.5 h-3.5" alt="currency" />
                        {total.toFixed(2)}
                        <span className="text-gray-400 text-sm ml-0.5">›</span>
                    </p>
                </div>
                <NextBtn />
            </div>

            {/* BACKDROP FOR MOBILE */}
            {open && (
                <div 
                    className="lg:hidden fixed inset-0 bg-black/40 z-50 transition-opacity duration-300"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* MOBILE EXPANDED VIEW - Compact */}
            <div
                className={`lg:hidden fixed left-0 w-full bg-white z-[60] transition-all duration-300 ease-in-out flex flex-col
                    ${open ? "bottom-0" : "-bottom-full"}`}
                style={{ maxHeight: '85vh', height: '85vh' }}
            >
                {/* Header Drag Handle */}
                <div className="flex justify-center pt-2 pb-1">
                    <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
                </div>

                {/* Header - Compact */}
                <div className="px-4 py-3 border-b border-gray-100 flex-shrink-0">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Order Summary</h2>
                            <p className="text-xs text-gray-500 mt-0.5">{itemSummary.length} item{itemSummary.length !== 1 ? 's' : ''}</p>
                        </div>
                        <button 
                            onClick={() => setOpen(false)}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <span className="text-xl text-gray-500">×</span>
                        </button>
                    </div>
                </div>

                {/* Scrollable Content - Compact */}
                <div 
                    className="flex-1 overflow-y-auto p-4"
                    style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#CBD5E0 #F7FAFC'
                    }}
                >
                    <style jsx>{`
                        div::-webkit-scrollbar {
                            width: 4px;
                        }
                        div::-webkit-scrollbar-track {
                            background: #F7FAFC;
                            border-radius: 2px;
                        }
                        div::-webkit-scrollbar-thumb {
                            background: #CBD5E0;
                            border-radius: 2px;
                        }
                        div::-webkit-scrollbar-thumb:hover {
                            background: #A0AEC0;
                        }
                    `}</style>

                    <div className="space-y-4">
                        {/* Service Items - Compact */}
                        <div>
                            <h3 className="font-semibold text-gray-700 mb-2 text-xs uppercase tracking-wider">Services</h3>
                            <div className="space-y-2">
                                {itemSummary.map((item, index) => (
                                    <div key={item.id} className="flex items-start justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="w-5 h-5 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors text-[10px] flex-shrink-0"
                                                >
                                                    ✕
                                                </button>
                                                <span className="font-medium text-gray-800 text-sm truncate">
                                                    {item.title}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 ml-7 truncate">{serviceTitle[index]}</p>
                                        </div>
                                        <div className="flex items-center gap-1 font-semibold text-gray-800 flex-shrink-0 ml-2">
                                            <img src={dirhum} className="w-3.5 h-3.5" alt="currency" />
                                            <span className="text-sm">{item.price}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Date & Time - Compact */}
                        {(date || time) && (
                            <div>
                                <h3 className="font-semibold text-gray-700 mb-2 text-xs uppercase tracking-wider">Schedule</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {date && (
                                        <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                                            <p className="text-[10px] text-gray-500 mb-0.5">Date</p>
                                            <p className="font-medium text-gray-800 text-sm truncate">{date}</p>
                                        </div>
                                    )}
                                    {time && (
                                        <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                                            <p className="text-[10px] text-gray-500 mb-0.5">Time</p>
                                            <p className="font-medium text-gray-800 text-sm truncate">{time}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Address - Compact */}
                        {(liveAddress || (address && address.length > 0)) && (
                            <div>
                                <h3 className="font-semibold text-gray-700 mb-2 text-xs uppercase tracking-wider">Address</h3>
                                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                    <p className="text-sm text-gray-800 leading-relaxed break-words">{address}</p>
                                </div>
                            </div>
                        )}

                        {/* Charges Breakdown - Compact */}
                        <div>
                            <h3 className="font-semibold text-gray-700 mb-2 text-xs uppercase tracking-wider">Price Details</h3>
                            <div className="space-y-2 bg-gray-50 rounded-lg p-3 border border-gray-200">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Subtotal</span>
                                    <span className="flex items-center gap-1 font-medium text-sm">
                                        <img src={dirhum} className="w-3.5 h-3.5" alt="currency" />
                                        {subTotal}
                                    </span>
                                </div>
                                
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Service Charge</span>
                                    <span className="flex items-center gap-1 font-medium text-sm">
                                        <img src={dirhum} className="w-3.5 h-3.5" alt="currency" />
                                        {serviceCharge}
                                    </span>
                                </div>
                                
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">VAT (5%)</span>
                                    <span className="flex items-center gap-1 font-medium text-sm">
                                        <img src={dirhum} className="w-3.5 h-3.5" alt="currency" />
                                        {vat.toFixed(2)}
                                    </span>
                                </div>
                                
                                {/* Divider */}
                                <div className="border-t border-gray-200 my-2"></div>
                                
                                <div className="flex justify-between items-center pt-2">
                                    <span className="font-semibold text-gray-800">Total Amount</span>
                                    <span className="flex items-center gap-1 font-bold text-lg text-gray-800">
                                        <img src={dirhum} className="w-4.5 h-4.5" alt="currency" />
                                        {total.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fixed Bottom Action - Compact */}
                <div className="border-t border-gray-100 bg-white px-4 py-3 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500">Total Payable</p>
                            <p className="text-lg font-bold flex items-center gap-1 text-gray-800">
                                <img src={dirhum} className="w-4.5 h-4.5" alt="currency" />
                                {total.toFixed(2)}
                            </p>
                        </div>
                        <NextBtn />
                    </div>
                </div>
            </div>
        </>
    );
};



// main component 
// import { useState } from "react";
// import dirhum from "../../assets/icon/dirhum.png";
// import NextBtn from "../NextBtn/NextBtn";
// import { useItem } from "../../provider/ItemProvider";

// export default function Summery({ total, showInput, setShowInput, vat, subTotal, itemSummary, serviceCharge, address, date, time, serviceTitle, liveAddress }) {
//     const [promo, setPromo] = useState("");
//     const [open, setOpen] = useState(false);
//     const { removeItem } = useItem();

//     const handleApply = () => {
//         if (promo.trim() === "") {
//             alert("Please enter a promo code!");
//             return;
//         }
//         setPromo("");
//         setShowInput(false);
//     };

//     return (
//         <>
//             {/* DESKTOP SUMMARY */}
//             <div className="hidden md:block w-[35%] text-gray-600 sticky top-20 self-start shadow-md rounded-md">
//                 <div className="p-4">
//                     <h2 className="text-xl font-medium mb-1.5">Summary</h2>

//                     {/* Service Details */}
//                     <div className="border-b border-gray-400 pb-1.5">
//                         <h3 className="font-semibold text-sm mb-2">Service Details</h3>
//                         <ul className="space-y-1">
//                             {itemSummary.map((item, index) => (
//                                 <div
//                                     key={index}
//                                     className="bg-white border border-gray-200 rounded-lg shadow-sm p-3 mb-2 hover:shadow-md transition-all"
//                                 >
//                                     <li className="flex justify-between items-center text-sm">
//                                         {/* Remove button */}
//                                         <button
//                                             onClick={() => removeItem(item.id)}
//                                             className="text-red-500 hover:bg-red-100 rounded-full px-2 py-0.5 text-xs font-semibold transition"
//                                         >
//                                             x
//                                         </button>

//                                         {/* Title */}
//                                         <span className="font-medium text-[14px] text-gray-700 flex-1 mx-3">
//                                             {item.title} — {serviceTitle[index]} × 1
//                                         </span>

//                                         {/* Price */}
//                                         <span className="flex items-center gap-1 font-semibold text-gray-800">
//                                             <img src={dirhum} alt="" className="w-3.5 h-3.5" />
//                                             {item.price}
//                                         </span>
//                                     </li>
//                                 </div>
//                             ))}
//                         </ul>
//                     </div>

//                     {/* Date & Time */}
//                     <div className="border-b border-gray-400 mt-2">
//                         <h3 className="font-semibold text-sm mb-2">Date & Time</h3>
//                         {(date || time) && (
//                             <div className="space-y-1">
//                                 {date && (
//                                     <div className="flex items-center justify-between">
//                                         <p className="text-[15px] font-semibold text-gray-700">Date</p>
//                                         <p className="text-[15px] font-semibold text-gray-700">{date}</p>
//                                     </div>
//                                 )}
//                                 {time && (
//                                     <div className="flex items-center justify-between">
//                                         <p className="text-[15px] font-semibold text-gray-700">Time</p>
//                                         <p className="text-[15px] font-semibold text-gray-700">{time}</p>
//                                     </div>
//                                 )}
//                             </div>
//                         )}
//                     </div>

//                     {/* Address Section - DESKTOP */}
//                     {(liveAddress || (address && address.length > 0)) && (
//                         <div className="border-b border-gray-400 mt-2">
//                             <h3 className="font-semibold text-[16px] mb-2">Address</h3>
//                             <div className="text-[16px] text-gray-700">
//                                 {address}
//                             </div>
//                         </div>
//                     )}

//                     {/* Discount Section */}
//                     <div className="mt-2 border-gray-400">
//                         <h2 className="font-semibold text-sm mb-2.5">Payment Details</h2>
//                         {!showInput && (
//                             <div className="flex justify-between items-center">
//                                 <h3 className="text-sm font-semibold">Discount</h3>
//                                 <h3 className="text-[13px] cursor-pointer font-semibold text-[#01788E] underline" onClick={() => setShowInput(true)}>
//                                     Apply Promo
//                                 </h3>
//                             </div>
//                         )}

//                         {showInput && (
//                             <div className="mt-2 flex items-center gap-2">
//                                 <input
//                                     type="text"
//                                     value={promo}
//                                     onChange={(e) => setPromo(e.target.value)}
//                                     placeholder="Enter Promo Discount"
//                                     className="w-full border border-gray-300 rounded-md px-2 py-1 text-[11px] focus:ring-2 focus:ring-[#01788E] outline-none"
//                                 />
//                                 <button
//                                     onClick={handleApply}
//                                     className="bg-[#01788E] text-white text-[11px] px-3 py-1 rounded-md hover:opacity-90 transition"
//                                 >
//                                     Apply
//                                 </button>
//                             </div>
//                         )}
//                     </div>

//                     {/* Charges */}
//                     {itemSummary.length > 0 && (
//                         <div className="mt-2 border-b border-gray-400 pb-3 space-y-1">
//                             <div className="flex justify-between text-sm">
//                                 <span className="font-semibold">Service Charges</span>
//                                 <span className="flex items-center gap-1 font-semibold">
//                                     <img src={dirhum} className="w-3.5 h-3.5" /> {serviceCharge}
//                                 </span>
//                             </div>

//                             <div className="flex justify-between text-sm">
//                                 <span className="font-semibold">Sub Total</span>
//                                 <span className="flex items-center gap-1 font-semibold">
//                                     <img src={dirhum} className="w-3.5 h-3.5" /> {subTotal}
//                                 </span>
//                             </div>

//                             <div className="flex justify-between text-sm">
//                                 <span className="font-semibold">VAT (5%)</span>
//                                 <span className="flex items-center gap-1 font-semibold">
//                                     <img src={dirhum} className="w-3.5 h-3.5" /> {vat}
//                                 </span>
//                             </div>
//                         </div>
//                     )}

//                     {/* Total */}
//                     <div className="mt-2 flex justify-between items-center">
//                         <h3 className="font-semibold">Total To Pay</h3>
//                         <p className="gap-2 text-[17px]">
//                             <span className="font-bold flex items-center">
//                                 <img className="h-[17px] w-[17px] mt-[3px]" src={dirhum} /> {total}
//                             </span>
//                         </p>
//                     </div>
//                 </div>
//             </div>

//             {/* MOBILE BOTTOM BAR */}
//             <div className="md:hidden fixed bottom-0 left-0 w-full bg-white shadow-[0_-2px_6px_rgba(0,0,0,0.15)] px-3 flex items-center justify-between z-50">
//                 <div onClick={() => setOpen(true)} className="cursor-pointer select-none">
//                     <p className="text-[12px] line-through text-gray-400">৳ {(total + serviceCharge + vat).toFixed(2)}</p>
//                     <p className="text-[20px] font-bold flex items-center gap-1 text-gray-700">
//                         <img src={dirhum} className="w-4 h-4" /> {total.toFixed(2)}
//                         <span className="text-[18px]">^</span>
//                     </p>
//                 </div>

//                 <NextBtn />
//             </div>

//             {/* MOBILE EXPANDED VIEW */}
//             <div
//                 className={`md:hidden fixed left-0 w-full bg-white shadow-xl rounded-t-2xl transition-all duration-300 z-50 p-4
//                     ${open ? "bottom-0" : "-bottom-full"}`}
//             >
//                 <div className="flex justify-between items-center pb-2 border-b">
//                     <h2 className="text-lg font-semibold">Summary</h2>
//                     <button onClick={() => setOpen(false)} className="text-xl">×</button>
//                 </div>

//                 <div className="mt-3 space-y-2 text-sm">
//                     {itemSummary.map((item) => (
//                         <div key={item.id} className="flex justify-between">
//                             <span>{item.title} x 1</span>
//                             <span className="flex items-center gap-1 font-semibold">
//                                 <img src={dirhum} className="w-3.5 h-3.5" /> {item.price}
//                             </span>
//                         </div>
//                     ))}

//                     {(date || time) && (
//                         <div className="pt-2 border-t">
//                             {date && <p className="flex justify-between"><span>Date:</span> <span>{date}</span></p>}
//                             {time && <p className="flex justify-between"><span>Time:</span> <span>{time}</span></p>}
//                         </div>
//                     )}

//                     {/* Address Section - MOBILE */}
//                     {(liveAddress || (address && address.length > 0)) && (
//                         <div className="pt-2 border-t text-sm leading-relaxed">
//                             <p className="font-semibold">Address:</p>
//                             {address}
//                         </div>
//                     )}

//                     <div className="pt-2 border-t space-y-1">
//                         <p className="flex justify-between">
//                             <span>Service Charge:</span>
//                             <span className="flex items-center gap-1">
//                                 <img src={dirhum} className="w-3.5 h-3.5" /> {serviceCharge}
//                             </span>
//                         </p>
//                         <p className="flex justify-between">
//                             <span>VAT (5%):</span>
//                             <span className="flex items-center gap-1">
//                                 <img src={dirhum} className="w-3.5 h-3.5" /> {vat.toFixed(2)}
//                             </span>
//                         </p>
//                     </div>

//                     <div className="pt-2 border-t flex justify-between text-base font-semibold">
//                         <span>Total</span>
//                         <span className="flex items-center gap-1">
//                             <img src={dirhum} className="w-4 h-4" /> {total.toFixed(2)}
//                         </span>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };