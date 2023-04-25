declare global {
    namespace Express {
        interface Request { }
        interface Response {
            success: () => void;
            fail: () => void;
        }
        interface Locals { 
            success: () => void;
            fail: () => void;
        }
        interface Application { }
    }
}