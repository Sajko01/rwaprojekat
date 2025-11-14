export interface AuthDto {
    email: string;
    password: string;
    nick?:string;
  }
  
  export interface CreateUserDto {
    email: string;
    password: string;
    nick?: string;
    address: string;
  }
  

  
export interface CreateCartDto {
  userEmail: string ;
  location: string;
}

