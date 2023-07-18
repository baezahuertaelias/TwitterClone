import { useCallback, useState } from "react";
import Input from "../Input";
import Modal from "../Modal";
import useRegisterModal from "@/hooks/useRegisterModal";
import useLoginModal from "@/hooks/useLoginModal"
import { signIn } from "next-auth/react";

const LoginModal = () => {
    const loginModal = useLoginModal();
    const registerModal = useRegisterModal();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = useCallback(async ()=> {
        try {
            setIsLoading(true)

            await signIn('credentials', {
                email,
                password
            })

            loginModal.onClose()
        } catch (error) {
            console.log('error onsubmit loginmodal', error)
        } finally {
            setIsLoading(false)
        }
    }, [loginModal, email, password]);

    const onToggle = useCallback(() => {
        if(isLoading){
            return;
        }

        loginModal.onClose();
        registerModal.onOpen();
    }, [isLoading, registerModal, loginModal])

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Input placeholder="Email" onChange={(e) => setEmail(e.target.value)} value={email} disabled={isLoading} />
            <Input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password} disabled={isLoading} />
        </div>
    )

    const footerContent = (
        <div className="text-neutral-400 text-center mt-4">Primera vez? <span onClick={onToggle} className="text-white cursor-pointer hover:underline">Crear cuenta</span> </div>
    )

    return (
        <Modal title="Login" disabled={isLoading} isOpen={loginModal.isOpen} actionLabel="Sign In" onClose={loginModal.onClose} onSubmit={onSubmit} body={bodyContent} footer={footerContent} />
    )
}

export default LoginModal