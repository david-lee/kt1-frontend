import { useCallback } from "react";
import api from "appConfig/restAPIs";
import { codeType } from 'data/constants';
import axios from "axios";

const useCode = () => {
  const getAllCode = useCallback(() => {
    return axios.get(api.code);
  }, []);

  const getCodeFor = (pCodeId) => {
    return axios.get(`${api.code}/${pCodeId}`);
  };

  const getUserType = () => getCodeFor(codeType.userType);
  const getMainCategory = () => getCodeFor(codeType.mainCat);
  // pCode is a main category code
  const getSubCategory = useCallback((pCode) => getCodeFor(pCode), []);
  const getProvince = () => getCodeFor(codeType.prov);
  // pCode is a province code
  const getCityFor = (pCode) => getCityFor(pCode);

  return {
    getAllCode,
    getMainCategory,
    getSubCategory,
    getProvince,
    getUserType,
    getCityFor,
  }
}

export default useCode;
