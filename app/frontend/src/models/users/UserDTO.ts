export interface UserDTO {
  ID_User: number;
  First_Name: string | null;
  Last_Name: string | null;
  Email: string;
  Birth_Date: string | null;
  Gender: string | null;
  Country: string | null;
  Street: string | null;
  Street_Number: string | null;
  role: string; 
  Image?: string;

  Username?: string
}