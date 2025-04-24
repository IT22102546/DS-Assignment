
// import React, { useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import { HiShoppingCart, HiStar,HiPhone,HiGift,HiClock,HiOutlineLightningBolt, HiChevronDown,HiMail, HiChevronUp,HiOutlineCalendar } from 'react-icons/hi';
// import HeroImage from '../assets/discount-banner.png';

// export default function Surprise() {
//   const location = useLocation();
//   const eventData = location.state?.newEvent;
//   const [expanded, setExpanded] = useState(false);
//   const [showAllPackages, setShowAllPackages] = useState(false);

//   // Default view when no event data exists
//   if (!eventData) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-[rgba(254,129,128,0.3)] via-[rgba(255,255,255,0.3)] to-[rgba(254,143,142,0.3)]">
//         {/* Hero Section */}
//         <div className="relative h-[380px] w-full overflow-hidden">
//           <img
//             src={HeroImage}
//             alt="Surprise Delivery"
//             className="w-full h-full object-cover"
//           />
//         </div>

//         {/* Surprise Events Heading */}
//         <div className="container mx-auto px-4 pt-8">
//           <h2 className="text-3xl font-bold text-center text-[#623B1C] mb-8">
//             Surprise Events
//           </h2>
//           <p className="text-center text-gray-600">No events created yet</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-[rgba(254,129,128,0.3)] via-[rgba(255,255,255,0.3)] to-[rgba(254,143,142,0.3)]">
//       {/* Hero Section */}
//       <div className="relative h-[380px] w-full overflow-hidden">
//         <img
//           src={HeroImage}
//           alt="Surprise Delivery"
//           className="w-full h-full object-cover"
//         />
//       </div>

//       {/* Surprise Events Heading */}
//       <div className="container mx-auto px-4 pt-8">
//         <h2 className="text-3xl font-bold text-center text-[#623B1C] mb-8">
//           Surprise Events
//         </h2>
//       </div>

//       {/* Event Container */}
//       <div className="container mx-auto px-4 pb-12">
//         {/* Event Card */}
//         <div className="max-w-5xl mx-auto border border-[#9A9393] rounded-lg p-6 mb-8">
//           {/* Main Content Area */}
//           <div className="flex flex-col md:flex-row gap-4">
//             {/* Left Column - Main Image with flexible height */}
//             <div className="w-full md:w-1/2 ">
//               <div className="w-[294px] h-[259px] top-[647px]  rounded-lg overflow-hidden">
//                 <img
//                   src={ eventData.mainImage}
//                   alt="Event"
//                   className="w-full h-full object-cover"

//                 />
//               </div>

//               {/* Contact Info - appears in same container as image when expanded */}
//               {expanded && (
//                 <div className="mt-2 p-4  rounded-lg h-[30%] flex flex-col justify-center">
//                   <h4 className="font-bold text-[#623B1C] mb-3">Contact Information</h4>
//                   <div className="space-y-3">
//                     <div className="flex items-center">
//                       <HiPhone className="text-[#623B1C] mr-3 w-5 h-5" />
//                       <span className="text-sm">+94 77 123 4567</span>
//                     </div>
//                     <div className="flex items-center">
//                       <HiMail className="text-[#623B1C] mr-3 w-5 h-5" />
//                       <span className="text-sm">contact@obhandmaker.com</span>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Right Column - Details */}
//             <div className="w-full flex flex-col">
//               <h2 className="text-2xl font-bold text-[#623B1C] mb-2">{eventData.title}</h2>
//               <div className="flex gap-1 mb-4">
//                 {[...Array(5)].map((_, i) => (
//                   <HiStar key={i} className="text-yellow-400" />
//                 ))}
//               </div>
//               <p className="text-gray-700 mb-4 whitespace-pre-line flex-grow">
//                 {expanded ? eventData.description : `${eventData.description.substring(0, 150)}...`}
//               </p>

//               {/* Event Activities with Icons */}
//               {eventData.eventActivities && (
//                 <div className="mb-4">
//                   <h4 className="font-semibold text-[#623B1C] flex items-center mb-2">
//                     <HiOutlineLightningBolt className="text-[#FE8180] mr-2" />
//                     What We Do:
//                   </h4>
//                   <ul className="space-y-2 pl-5">
//                     {eventData.eventActivities.split('\n').filter(line => line.trim()).map((activity, i) => (
//                       <li key={i} className="text-sm flex items-start text-gray-700">
//                         <span className="text-[#623B1C] mr-2">•</span>
//                         <span>{activity.trim()}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}

//               {/* Event Types in Bold */}
//               {eventData.category && (
//                 <div className="mb-4">
//                   <h4 className="font-semibold text-[#623B1C] flex items-center mb-2">
//                     <HiOutlineCalendar className="text-[#FE8180] mr-2" />
//                     Events categories:
//                   </h4>
//                   <ul className="space-y-2 pl-5">
//                     {eventData.category.split('\n').filter(line => line.trim()).map((type, i) => (
//                       <li key={i} className="text-sm flex items-start">
//                         <span className="font-bold text-[#623B1C] mr-2">•</span>
//                         <span className="font-bold">{type.trim()}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Packages Section (Shows when expanded, centered) */}
//           {expanded && (
//             <div className="mt-8">
//               <h3 className="text-xl font-bold text-center text-[#623B1C] mb-6">
//                 Available Packages
//               </h3>

//               <div className=" flex flex-wrap justify-center gap-6">
//                 {eventData.packages.slice(0, showAllPackages ? eventData.packages.length : 2).map((pkg, i) => (
//                   <div
//                     key={i}
//                     className="flex-1 min-w-[280px] max-w-[300px] border-2 border-[#9A9393] rounded-[25px] overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col"
//                   >
//                     {/* Section 1: Package Name */}
//                     <div className="p-4 text-center border-b border-[#9A9393] bg-white">
//                       <h4 className="font-bold text-lg text-[#623B1C]">{pkg.name}</h4>
//                     </div>

//                     {/* Section 2: Content Area */}
//                     <div className="p-4 flex-grow flex flex-col">
//                       {/* Occasions */}
//                       <div className="mb-4">
//                         {/* <h5 className="font-semibold text-[#623B1C] mb-2">Occasions:</h5> */}
//                         <ul className="space-y-1 pl-4">
//                           {pkg.occasions.split(',').map((occasion, j) => (
//                             <li key={j} className="text-sm flex items-start">
//                               <span className="text-[#623B1C] mr-2">•</span>
//                               <span>{occasion.trim()}</span>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>

//                       {/* Activities */}
//                       <div className="mb-4">
//                         {/* <h5 className="font-semibold text-[#623B1C] mb-2">Activities:</h5> */}
//                         <ul className="space-y-1 pl-4">
//                           {pkg.activities.split(',').map((activity, j) => (
//                             <li key={j} className="text-sm flex items-start">
//                               <span className="text-[#623B1C] mr-2">•</span>
//                               <span>{activity.trim()}</span>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>

//                       {/* Price positioned at bottom */}
//                       <div className="mt-auto text-right">
//                         <p className="text-[#FE8180] font-bold text-lg">LKR {pkg.price}</p>
//                       </div>
//                     </div>

//                     {/* Section 3: Proceed Button */}
//                     <div className="p-4 border-t border-[#9A9393] text-center">
//                       <button className="bg-[#623B1C] hover:bg-[#4a2c14] text-white px-6 py-2 rounded-full flex items-center mx-auto transition-colors">
//                         <HiShoppingCart className="mr-2" />
//                         Proceed
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Show More/Less button for packages */}
//               {eventData.packages.length > 2 && (
//                 <div className="text-center mt-6">
//                   <button
//                     onClick={() => setShowAllPackages(!showAllPackages)}
//                     className="text-[#623B1C] font-semibold flex items-center justify-center mx-auto"
//                   >
//                     {showAllPackages ? (
//                       <>
//                         <HiChevronUp className="mr-1" />
//                         Show Less Packages
//                       </>
//                     ) : (
//                       <>
//                         <HiChevronDown className="mr-1" />
//                         Show All {eventData.packages.length} Packages
//                       </>
//                     )}
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}

//         {/* Related Works and Read More in same line */}
//         <div className="flex justify-between items-center mt-6">
//           {eventData.images.length > 1 && (
//               <h3 className="text-[#623B1C] font-semibold">Related Works</h3>
//             )}

//             {/* Read More button positioned at right */}
//             <button
//               onClick={() => setExpanded(!expanded)}
//               className="text-[#623B1C] font-semibold"
//             >
//               {expanded ? 'Show Less' : 'Read More >>>'}
//             </button>
//         </div>

//         {/* Related Works Images (shown below) */}
//         {eventData.images.length > 1 && (
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
//             {eventData.images.filter(img => img !== eventData.mainImage).slice(0,4).map((img, index) => (
//               <div key={index} className="h-40 rounded-lg overflow-hidden">
//                 <img
//                   src={img}
//                   alt={`Related work ${index + 1}`}
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//             ))}
//           </div>
//         )}

//       </div>
//     </div>
//   </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  HiStar,
  HiPhone,
  HiChevronDown,
  HiMail,
  HiChevronUp,
  HiHome,
  HiHeart,
  HiGift,
  HiBriefcase,
  HiCake,
  HiUserGroup,
} from "react-icons/hi";
import "aos/dist/aos.css";
import AOS from "aos";
import HeroImage from "../assets/discount-banner.png";
import parse from "html-react-parser";
import DOMPurify from "dompurify";

export default function Surprise() {
  const [team, setTeam] = useState([]);
  const [teamEvents, setTeamEvents] = useState({});
  const [selectedEvents, setSelectedEvents] = useState({});
  const [totalPrice, setTotalPrice] = useState({});
  const [showAllEvents, setShowAllEvents] = useState({});
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState({
    teams: true,
    events: {},
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (!currentUser) {
      navigate("/sign-in");
      return;
    }
    AOS.init({ duration: 1000, once: true });
    fetchTeams();
  }, [currentUser, navigate]);

  const fetchTeams = async () => {
    try {
      setLoading((prev) => ({ ...prev, teams: true }));
      setError(null);

      const res = await fetch("/api/user/getteams", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch teams");
      }

      const data = await res.json();
      setTeam(data.teams);

      const eventsLoading = {};
      data.teams.forEach((teamMember) => {
        eventsLoading[teamMember._id] = true;
        fetchTeamEvents(teamMember._id);
      });


      setLoading((prev) => ({
        ...prev,
        teams: false,
        events: eventsLoading,
      }));
    } catch (error) {
      console.error("Failed to fetch teams", error);
      setError(error.message);
      setLoading((prev) => ({ ...prev, teams: false }));
    }
  };

  const fetchTeamEvents = async (teamId) => {
    try {
      setLoading((prev) => ({
        ...prev,
        events: { ...prev.events, [teamId]: true },
      }));

      const res = await fetch(`/api/events/getEventsByShop/${teamId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch events for team ${teamId}`);
      }

      const data = await res.json();
      setTeamEvents((prev) => ({ ...prev, [teamId]: data.events }));

      setLoading((prev) => ({
        ...prev,
        events: { ...prev.events, [teamId]: false },
      }));
    } catch (error) {
      console.error(`Failed to fetch events for team ${teamId}`, error);
      setLoading((prev) => ({
        ...prev,
        events: { ...prev.events, [teamId]: false },
      }));
    }
  };

  const handleEventSelection = (teamId, event) => {
    setSelectedEvents((prev) => {
      const currentSelection = prev[teamId] || [];
      let updatedSelection;

      if (currentSelection.some((e) => e._id === event._id)) {
        updatedSelection = currentSelection.filter((e) => e._id !== event._id);
      } else {
        updatedSelection = [...currentSelection, event];
      }

      setTotalPrice((prevPrice) => ({
        ...prevPrice,
        [teamId]: updatedSelection.reduce((total, e) => total + e.price, 0),
      }));

      return { ...prev, [teamId]: updatedSelection };
    });
  };

  const handleBooking = (teamId) => {
    const teamMember = team.find((t) => t._id === teamId);
    if (
      !teamMember ||
      !selectedEvents[teamId] ||
      selectedEvents[teamId].length === 0
    ) {
      alert("Please select at least one event before booking.");
      return;
    }
    navigate("/bookingsummary", {
      state: {
        teamName: teamMember.username,
        teamId: teamId,
        selectedEvents: selectedEvents[teamId],
        totalPrice: totalPrice[teamId] || 0,
      },
    });
  };

  const toggleShowAllEvents = (teamId) => {
    setShowAllEvents((prev) => ({ ...prev, [teamId]: !prev[teamId] }));
  };

  const getEventIcon = (eventType) => {
    if (!eventType) return <HiUserGroup className="text-yellow-500 mr-2" />;

    const type = eventType.toLowerCase().trim();


    if (type.includes("birthday") || type.includes("bday")) {
      return <HiCake className="text-pink-500 mr-2" />;
    }
    if (
      type.includes("proposal") ||
      type.includes("marriage") ||
      type.includes("anniversary") ||
      type.includes("valentine")
    ) {
      return <HiHeart className="text-red-500 mr-2" />;
    }
    if (
      type.includes("baby") ||
      type.includes("shower") ||
      type.includes("gender") ||
      type.includes("reveal")
    ) {
      return <HiGift className="text-blue-500 mr-2" />;
    }
    if (
      type.includes("office") ||
      type.includes("corporate") ||
      type.includes("work") ||
      type.includes("employee")
    ) {
      return <HiBriefcase className="text-purple-500 mr-2" />;
    }
    if (
      type.includes("home") ||
      type.includes("house") ||
      type.includes("family")
    ) {
      return <HiHome className="text-green-500 mr-2" />;
    }
    return <HiUserGroup className="text-yellow-500 mr-2" />;
  };

  const sanitizeAndParse = (html) => {
    if (!html) return null;
    // First remove all HTML tags to get clean text
    const textOnly = html.replace(/<[^>]*>/g, "");
    // Then sanitize any remaining HTML entities
    const clean = DOMPurify.sanitize(textOnly);
    return parse(clean);
  };

  const toggleExpand = (memberId) => {
    setExpanded((prev) => ({
      ...prev,
      [memberId]: !prev[memberId],
    }));
  };

  if (loading.teams) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[rgba(254,129,128,0.3)] via-[rgba(255,255,255,0.3)] to-[rgba(254,143,142,0.3)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#623B1C] mx-auto"></div>
          <p className="mt-4 text-[#623B1C]">Loading teams...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[rgba(254,129,128,0.3)] via-[rgba(255,255,255,0.3)] to-[rgba(254,143,142,0.3)] flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <button
            onClick={fetchTeams}
            className="bg-[#623B1C] hover:bg-[#4a2c14] text-white px-6 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (team.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[rgba(254,129,128,0.3)] via-[rgba(255,255,255,0.3)] to-[rgba(254,143,142,0.3)]">
        <div className="relative h-[380px] w-full overflow-hidden">
          <img
            src={HeroImage}
            alt="Surprise Delivery"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 pt-8">
          <h2 className="text-3xl font-bold text-center text-[#623B1C] mb-8">
            Surprise Teams
          </h2>
          <p className="text-center text-gray-600">No teams available yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[rgba(254,129,128,0.3)] via-[rgba(255,255,255,0.3)] to-[rgba(254,143,142,0.3)]">
      <div className="relative h-[380px] w-full overflow-hidden">
        <img
          src={HeroImage}
          alt="Surprise Delivery"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container mx-auto px-4 pt-8">
        <h2 className="text-3xl font-bold text-center text-[#623B1C] mb-8">
          Surprise Teams
        </h2>
      </div>

      <div className="container mx-auto px-4 pb-12">
        {team.map((member) => (
          <div
            key={member._id}
            className="max-w-4xl mx-auto border border-[#9A9393] rounded-lg p-6 mb-8 bg-white"
            data-aos="fade-up"
          >
            {/* Main Content Area */}
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left Column - Profile Image */}
              <div className="w-full md:w-1/3">
                <img
                  src={
                    member.profilePicture || "https://via.placeholder.com/300"
                  }
                  alt={member.username}
                  className="w-full h-auto rounded-lg object-cover mb-4"
                />

{expanded[member._id] && (

                <>
                  {/* Contact Information */}
                  <div className="mt-6 p-4 bg-[#FEF6F6] rounded-lg">
                    <h4 className="font-bold text-[#623B1C] mb-3">
                      Contact Information
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <HiPhone className="text-[#623B1C] mr-3 w-5 h-5" />
                        <span className="text-sm">
                          {member.mobile || "Not provided"}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <HiMail className="text-[#623B1C] mr-3 w-5 h-5" />
                        <span className="text-sm">
                          {member.email || "Not provided"}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              </div>

              
              {/* Right Column - Details */}
              <div className="w-full md:w-2/3 flex flex-col">
                <h2 className="text-2xl font-bold text-[#623B1C] mb-2">
                  {member.username} {member.lastName && ` ${member.lastName}`}
                </h2>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <HiStar key={i} className="text-yellow-400" />
                  ))}
                </div>

                <div className="text-gray-700 mb-4">
                  {sanitizeAndParse(member.description) ||
                    "We specialize in creating unforgettable surprise events tailored to your unique vision. Whether it's a Birthday, anniversary or social celebration, our team of experienced planners ensures every detail is flawlessly executed."}
                </div>

                <h4 className="font-bold text-[#623B1C] mb-3">What We Do:</h4>
                <ul className="space-y-3 mb-4">

                  {member.events?.length > 0 ? (
                    member.events.slice(0, 3).map((event, index) => (
                      <li key={index} className="flex items-start">
                        {getEventIcon(event.name)}
                        <span className="font-medium">
                          {event.name || "Not Added"}
                        </span>
                      </li>
                    ))
                  ) : (
                    <>
                      <li className="flex items-start">
                        <HiCake className="text-pink-500 mr-2" />
                        <div className="flex flex-col sm:flex-row sm:items-baseline">
                          <span className="font-medium mr-2">
                            Birthday Events
                          </span>
                          <span className="text-gray-400 text-sm">
                            - Not added by team
                          </span>
                        </div>
                      </li>

                      <li className="flex items-start">
                        <HiHeart className="text-red-500 mr-2" />
                        <div className="flex flex-col sm:flex-row sm:items-baseline">
                          <span className="font-medium mr-2">
                            Romantic Events
                          </span>
                          <span className="text-gray-400 text-sm">
                            - Not added by team
                          </span>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <HiGift className="text-blue-500 mr-2" />
                        <div className="flex flex-col sm:flex-row sm:items-baseline">
                          <span className="font-medium mr-2">Baby Events</span>
                          <span className="text-gray-400 text-sm">
                            - Not added by team
                          </span>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <HiBriefcase className="text-purple-500 mr-2" />
                        <div className="flex flex-col sm:flex-row sm:items-baseline">
                          <span className="font-medium mr-2">
                            Corporate Events
                          </span>
                          <span className="text-gray-400 text-sm">
                            - Not added by team
                          </span>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <HiHome className="text-green-500 mr-2" />
                        <div className="flex flex-col sm:flex-row sm:items-baseline">
                          <span className="font-medium mr-2">Home Events</span>
                          <span className="text-gray-400 text-sm">
                            - Not added by team
                          </span>
                        </div>
                      </li>
                    </>
                  )}
                </ul>


                {/* Show More button */}
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => toggleExpand(member._id)}
                    className="text-[#623B1C] font-semibold flex items-center"
                  >
                    {expanded[member._id] ? "Show Less" : "Show More >>>"}
                  </button>
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {expanded[member._id] && (
              <>
                {/* Packages Section */}
                {!loading.events[member._id] &&
                  teamEvents[member._id]?.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-xl font-bold text-[#623B1C] mb-6">
                        Available Packages
                      </h3>


                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {(showAllEvents[member._id]
                          ? teamEvents[member._id]
                          : teamEvents[member._id].slice(0, 3)
                        ).map((event) => (
                          <div
                            key={event._id}
                            className="border-2 border-[#9A9393] rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
                          >
                            <div className="p-4 border-b border-[#9A9393]">
                              <div className="flex items-center">
                                {getEventIcon(event.title)}
                                <h4 className="font-bold text-lg">
                                  {event.title}
                                </h4>
                              </div>
                              <p className="text-[#9A9393] font-bold mt-1">
                                LKR {event.price}
                              </p>
                            </div>


                            <div className="p-4 h-[200px] overflow-y-auto">
                              {event.occasions?.length > 0 ? (
                                <ul className="space-y-2">
                                  {event.occasions.map((occasion, index) => (
                                    <li
                                      key={index}
                                      className="flex items-start"
                                    >
                                      <span className="mr-2">•</span>
                                      <span>{occasion}</span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-gray-500">
                                  No occasions specified
                                </p>
                              )}
                            </div>


                            <div className="p-4 border-t border-[#9A9393] flex items-center justify-center ">
                              <input
                                type="checkbox"
                                className="w-5 h-5 mr-3  text-[#FE8180] focus:ring-[#FE8180] border-gray-300 rounded" 

                                checked={selectedEvents[member._id]?.some(
                                  (e) => e._id === event._id
                                )}
                                onChange={() =>
                                  handleEventSelection(member._id, event)
                                }
                              />
                              <button

                                className=" bg-[#FE8180] hover:bg-[#e57373] text-white px-6 py-2 rounded-full flex items-center transition-colors"

                                onClick={() =>
                                  handleEventSelection(member._id, event)
                                }
                              >
                                {selectedEvents[member._id]?.some(
                                  (e) => e._id === event._id
                                )
                                  ? "Selected"
                                  : "Select"}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {teamEvents[member._id].length > 3 && (
                        <div className="text-center mt-6">
                          <button
                            onClick={() => toggleShowAllEvents(member._id)}
                            className="text-[#623B1C] font-semibold flex items-center justify-center mx-auto"
                          >
                            {showAllEvents[member._id] ? (
                              <>
                                <HiChevronUp className="mr-1" />
                                Show Less Packages
                              </>
                            ) : (
                              <>
                                <HiChevronDown className="mr-1" />
                                Show All {teamEvents[member._id].length}{" "}
                                Packages
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                {/* Related Works */}
                {member.workImages?.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-[#623B1C] mb-4">
                      Related Works
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {member.workImages.slice(0, 4).map((imageUrl, index) => (
                        <div
                          key={index}
                          className="h-40 rounded-lg overflow-hidden"
                        >
                          <img
                            src={imageUrl}
                            alt={`Work sample ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Booking Summary */}
            {selectedEvents[member._id]?.length > 0 && (
              <div className="mt-6 p-4 bg-[#FEF6F6] rounded-lg flex justify-between items-center">
                <span className="text-[#623B1C] font-semibold">
                  Total: LKR {totalPrice[member._id] || 0}
                </span>
                <button
                  onClick={() => handleBooking(member._id)}

                  className=" bg-[#FE8180] hover:bg-[#e57373] text-white px-6 py-2 rounded-lg"

                >
                  Book Now
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
