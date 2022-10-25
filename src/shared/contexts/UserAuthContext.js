import React, { createContext, useCallback, useContext, useState } from 'react';
import axios from 'axios';
import useLocalStorage from 'shared/hooks/useLocalStorage';
import api from '../../appConfig/restAPIs';
import { permissionType, roleType } from 'data/constants';

const UserContext = createContext();

const UserAuthProvider = ({children}) => {
  const [user, setUser] = useLocalStorage("user", null);
  const [error, setError] = useState(null);

  const login = useCallback(({loginId, password}) => {
    axios.post(api.login, { loginId, password })
      .then((resp) => {
        const { primaryName, userId, authToken, permission, dept, role } = resp.data;
        setUser({ name: primaryName, userId: userId, authToken: authToken, dept, permission: permission.label, role: role.label });
      })
      .catch((e) => {
        setError(e.message);
      });
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem("user");
    window.location.reload();
    // axios.post(api.logout, { loginId: user.userId })
    //   .then(() => {
    //     setUser(null);
    //   });
  }, []);

  const resetPassword = useCallback(({ loginId, password }) => {
    axios.post(api.resetPassword, { loginId, password })
      .then(({data}) => {
        setUser({email: data.email, name: data.username, userId: data.userId, authToken: data.token});
      })    
  }, []);

  const canDo = useCallback((company) => {
    if (user) {
      const { userId, permission, role } = user;

      const canEdit = role !== roleType.director && 
                      (role >= roleType.manager || 
                        (userId === company.salesPerson.value && permission >= permissionType.write));
      const canDelete = canEdit && permission === permissionType.delete;

      return { canEdit, canDelete };
    }

    return {};
  }, [user]);

  return (
    <UserContext.Provider value={{ user, error, canDo, login, logout, resetPassword }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUserAuth = () => useContext(UserContext);

export default UserAuthProvider;
