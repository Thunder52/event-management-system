import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProfiles,
  addProfile as addProfileThunk,
} from '../../redux/slices/profileReducer';
import { setActiveProfile } from '../../redux/slices/profileReducer';
import './ProfileDropdown.css';

export default function ProfileDropdown() {
  const dispatch = useDispatch();
  const { profiles, loading } = useSelector((state) => state.profile);

  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [newProfile, setNewProfile] = useState('');
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (!hasLoaded) {
      dispatch(fetchProfiles(''));
      setHasLoaded(true);
    }
  }, [dispatch, hasLoaded]);

  useEffect(() => {
    if (hasLoaded) {
      dispatch(fetchProfiles(search));
    }
  }, [search, dispatch, hasLoaded]);

  // 🔥 auto select first profile
  useEffect(() => {
    if (!selected && profiles.length > 0) {
      const firstProfile = profiles[0];
      setSelected(firstProfile);
      dispatch(setActiveProfile(firstProfile._id));
    }
  }, [profiles, selected, dispatch]);

  const addProfile = async () => {
    if (!newProfile.trim()) return;

    const result = await dispatch(addProfileThunk(newProfile.trim()));

    if (result.meta.requestStatus === 'fulfilled') {
      setNewProfile('');
      dispatch(fetchProfiles(search));
    }
  };

  return (
    <div className="profile-dropdown">
      <div className="profile-selected" onClick={() => setOpen(!open)}>
        {selected?.name || 'Select profile'}
        <span>▾</span>
      </div>

      {open && (
        <div className="profile-menu">
          <input
            type="text"
            placeholder="Search current profile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />

          <div className="profile-list">
            {loading && <div className="loading">Loading...</div>}

            {!loading && profiles.length === 0 && (
              <div className="empty">No profiles found</div>
            )}

            {!loading &&
              profiles.map((profile) => (
                <div
                  key={profile._id}
                  className={`profile-item ${
                    selected?._id === profile._id ? 'active' : ''
                  }`}
                  onClick={() => {
                    setSelected(profile);
                    dispatch(setActiveProfile(profile._id));
                    setOpen(false);
                  }}
                >
                  {profile.name}
                </div>
              ))}
          </div>

          <div className="add-profile">
            <input
              type="text"
              placeholder="Enter profile name"
              value={newProfile}
              onChange={(e) => setNewProfile(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addProfile();
                }
              }}
            />
            <button onClick={addProfile}>Add</button>
          </div>
        </div>
      )}
    </div>
  );
}
