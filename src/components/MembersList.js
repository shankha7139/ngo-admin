import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { User, Mail, Phone, MapPin, Search, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import ConfirmationDialog from './ConfirmationDialog';
import BouncingDotsLoader from './BouncingDotsLoader';

const MembersList = () => {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);

  const fetchMembers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'members'));
      const membersData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setMembers(membersData);
      setFilteredMembers(membersData);
    } catch (error) {
      console.error("Error fetching members: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    const results = members.filter(member =>
      Object.values(member).some(value =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredMembers(results);
  }, [searchTerm, members]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const toggleDropdown = (id) => {
    setDropdownVisible((prevState) => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  const handleDeleteClick = (member) => {
    setMemberToDelete(member);
    setIsDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (memberToDelete) {
      try {
        await deleteDoc(doc(db, 'members', memberToDelete.id));
        setMembers(members.filter(member => member.id !== memberToDelete.id));
        setFilteredMembers(filteredMembers.filter(member => member.id !== memberToDelete.id));
      } catch (error) {
        console.error("Error deleting member: ", error);
      } finally {
        setIsDialogOpen(false);
        setMemberToDelete(null);
      }
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setMemberToDelete(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="px-6 py-8 sm:px-10 sm:py-10 bg-gradient-to-r from-indigo-600 to-purple-600">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="mb-6 sm:mb-0">
                <h2 className="text-3xl font-extrabold text-white">Members Directory</h2>
                <p className="mt-2 text-indigo-100">
                  Explore our vibrant community
                </p>
              </div>
              <div className="w-full sm:w-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search members..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                </div>
              </div>
            </div>
          </div>
          <div className="px-6 py-8 sm:px-10 sm:py-10">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <BouncingDotsLoader />
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredMembers.map((member) => (
                  <div key={member.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-lg relative">
                    <button
                      className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                      onClick={() => handleDeleteClick(member)}
                    >
                      <Trash2 size={20} />
                    </button>
                    <div className="flex items-center p-4 bg-gradient-to-r from-indigo-100 to-purple-100">
                      <div className="h-16 w-16 rounded-full border-2 border-white shadow-lg overflow-hidden">
                        <img src={member.photo} alt={`${member.name}'s photo`} className="h-full w-full object-cover" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-800">{member.name}</h3>
                        <p className="text-sm text-gray-600">{member.qualification}</p>
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="hidden sm:block">
                        <div className="flex items-center text-sm text-gray-600">
                          <User size={16} className="mr-2 text-indigo-500" />
                          {member.gender}, {member.age} years
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail size={16} className="mr-2 text-indigo-500" />
                          {member.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone size={16} className="mr-2 text-indigo-500" />
                          {member.phoneNumber}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin size={16} className="mr-2 text-indigo-500" />
                          {member.address}
                        </div>
                      </div>
                      <div className={`sm:hidden ${dropdownVisible[member.id] ? 'block' : 'hidden'}`}>
                        <div className="flex items-center text-sm text-gray-600">
                          <User size={16} className="mr-2 text-indigo-500" />
                          {member.gender}, {member.age} years
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail size={16} className="mr-2 text-indigo-500" />
                          {member.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone size={16} className="mr-2 text-indigo-500" />
                          {member.phoneNumber}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin size={16} className="mr-2 text-indigo-500" />
                          {member.address}
                        </div>
                      </div>
                    </div>
                    <div className="px-4 pb-4 sm:hidden">
                      <button
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={() => toggleDropdown(member.id)}
                      >
                        {dropdownVisible[member.id] ? 'Hide Details' : 'View Details'}
                        {dropdownVisible[member.id] ? (
                          <ChevronUp size={16} className="inline-block ml-2" />
                        ) : (
                          <ChevronDown size={16} className="inline-block ml-2" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <ConfirmationDialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default MembersList;
