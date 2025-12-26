import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfiles, addProfile } from '../../redux/slices/profileReducer';

export default function MultiProfileDropdown({
  selectedProfiles = [],
  setSelectedProfiles,
}) {
  const dispatch = useDispatch();
  const { profiles } = useSelector((state) => state.profile);

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [newProfileName, setNewProfileName] = useState('');
  const [showAddInput, setShowAddInput] = useState(false);

  /* Fetch profiles on open + search */
  useEffect(() => {
    if (open) {
      dispatch(fetchProfiles(search));
    }
  }, [ search]);

const toggleProfile = (profile) => {
  if (selectedProfiles.includes(profile._id)) {
    setSelectedProfiles(
      selectedProfiles.filter((id) => id !== profile._id)
    );
  } else {
    setSelectedProfiles([...selectedProfiles, profile._id]);
  }
};
  const handleAddProfile = async () => {
    if (!newProfileName.trim()) return;

    await dispatch(addProfile(newProfileName.trim()));
    setNewProfileName('');
    setShowAddInput(false);
    dispatch(fetchProfiles(search));
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          padding: '10px 14px',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          background: '#f9fafb',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '14px',
          color: selectedProfiles.length ? '#111827' : '#9ca3af',
        }}
      >
        <span>
          {selectedProfiles.length
            ? `${selectedProfiles.length} profiles selected`
            : 'Select profiles...'}
        </span>
        <span style={{ color: '#6b7280', fontSize: '12px' }}>▾</span>
      </div>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '10px',
            zIndex: 20,
          }}
        >
          <div style={{ padding: '10px' }}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search profiles..."
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: '6px',
                border: '1px solid #e5e7eb',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          {/* List */}
          <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
            {profiles.map((profile) => {
              const isSelected = selectedProfiles.includes(profile._id);
              return (
                <div
                  key={profile._id}
                  onClick={() => toggleProfile(profile)}
                  style={{
                    padding: '10px 12px',
                    background: isSelected ? '#8b5cf6' : 'transparent',
                    color: isSelected ? 'white' : '#374151',
                    cursor: 'pointer',
                  }}
                >
                  {profile.name} {isSelected && '✓'}
                </div>
              );
            })}
          </div>

          {/* Add profile */}
          {showAddInput ? (
            <div style={{ padding: '10px', display: 'flex', gap: '6px' }}>
              <input
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                placeholder="Profile name"
                autoFocus
                style={{ flex: 1, padding: '8px' }}
              />
              <button style={{
                  padding: '8px 10px',
                  background: '#8b5cf6',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white',
                  cursor: 'pointer',
              }} onClick={handleAddProfile}>Add</button>
            </div>
          ) : (
            <div
              onClick={() => setShowAddInput(true)}
              style={{
                padding: '10px',
                textAlign: 'center',
                cursor: 'pointer',
                color: '#8b5cf6',
              }}
            >
              + Add Profile
            </div>
          )}
        </div>
      )}
    </div>
  );
}
