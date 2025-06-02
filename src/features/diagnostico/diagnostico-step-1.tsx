import { useDiagnosisStore } from "@/hooks";
import { Button, CaixaDeUpload, Dropdown } from "@/components";
import mulherDiagnostico from '../../assets/imgs/mulher_raiox2.png'
import { client } from "@/client"
import { FC, PropsWithChildren, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { useNavigate } from "react-router";

export const DiagnosticoStep1: FC<PropsWithChildren<{req: any, setReq: (arg: any) => void}>> = (props) => {
  // const [reqStatus, setReqStatus] = useState("unrequested");
  const [sexo, setSexo] = useState<{ label: string; value: string }>();
  const [ file, setFile ] = useState<File>()
  const [ imagem, setImagem ] = useState<any[]>([])
  const [ reqLimiter, setReqLimiter ] = useState<boolean>(false)

  const updateCurrentStep = useDiagnosisStore((state) => state.setDiagnosticoStep);
  // const currentPage = useDiagnosisStore((state) => state.diagnosticoStep);
  const { toast } = useToast()
  const examType = useDiagnosisStore((state) => state.diagnostico)
  const setExamType = useDiagnosisStore((state) => state.setDiagnostico)
  const navigate = useNavigate()
  const isIdadeOssea = examType === 'idade_ossea'

  useEffect(() => {
    if(!!localStorage.getItem('diagnosisType')){
      const examType = localStorage.getItem('diagnosisType')!
      setExamType(examType)
    }
  }, [])

  const handleClick = async () => {
    if(examType === '') {
      toast.error('Erro ao selecionar tipo de exame. Tente novamente')
      navigate('/')
      return
    }
    try {
      setReqLimiter(true)
      if (!!file){
        const reqBody = {
          file: file,
          exam_type: examType,
          patient_sex: sexo?.value,
          // MUDAR EMBAIXO MANUALMENTE OS VALORES DA DOENÇA
          selected_diseases_json: ['pneumonia', 'derrame pleural', 'a', 'b', 'c', 'dwadw']
        }
        const requisitionToast = toast.loading('Analisando exame')
        await client.sendImage('/diagnose', reqBody).then((resBody) => {
          setReqLimiter(false) 
          toast.update.success(requisitionToast)
          props.setReq({file: reqBody.file, ...resBody})
        }).then(() => {
          updateCurrentStep(2)
        })
      }
    } catch (error: any) {
      if (error.response){
        const axiosError: AxiosError = error
        const statusText = axiosError.response?.request.statusText || undefined
        const statusCode = axiosError.response?.request.status || undefined
        toast.error(`${statusCode? statusCode: ''} : ${statusText? statusText.toString() : ''}`)
        setReqLimiter(false)
      }
      throw error
    }
  }

  useEffect(() => {
    if(!!imagem[0]){
      const propAssertion = Object.keys(imagem[0]).find((el) => el === 'file')
      if(!!propAssertion) {
        setFile(imagem[0])
      }
    }
  }, [imagem])

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-7">
      <div className="relative bg-linear-to-r from-gradient-brightblue to-gradient-darkblue items-start rounded-2xl
          grid grid-cols-2
          2xl:min-w-[1475px] xl:w-[980px] lg:w-[800px]
          2xl:p-15 2xl:px-16 xl:p-10 p-10 px-12">
          <div className="flex flex-col w-full h-full">
            {!!isIdadeOssea && (
              <Dropdown
                buttonClassName={`
                z-100
              hover:cursor-pointer bg-white rounded-sm ${
                !!sexo ? "text-black" : "text-gray-500"
              }
              2xl:w-[280px] 2xl:py-1 2xl:p-3 2xl:mb-6 2xl:text-sm
              xl:w-[260px] xl:py-1 xl:p-2
              w-[200px] p-2 py-1 text-xs mb-4

              `}
                itemClassName={`
                2xl:w-[268px]  
                xl:w-[248px]  
                w-[190px]
                z-200
            `}
                placeholderText="Selecione o sexo do paciente"
                opcaoSelecionada={sexo}
                setOpcaoSelecionada={setSexo}
                options={[
                  {
                    label: "Masculino",
                    value: "masculino",
                  },
                  {
                    label: "Feminino",
                    value: "feminino",
                  },
                ]}
              ></Dropdown>
            )}
            <CaixaDeUpload
              imagem={imagem}
              setImagem={setImagem}
              serverResponseStatus={'unrequested'}
            />
            <p className="text-white pt-3 text-xs">
              Somente PNG e JPG (4mb max)
            </p>
          </div>

        <div className="absolute z-10 w-full h-full flex justify-end items-end 2xl:pr-5 pr-3">
          <img src={mulherDiagnostico} alt="" className="2xl:max-h-[100%] xl:max-h-[80%] max-h-[90%]" />
        </div>
      </div>
      <Button
        disabled={!imagem.length || !!reqLimiter}
        className={`${!imagem.length && 'bg-gray-500 hover:bg-gray-500 hover:cursor-default'}`}
        onClick={() => {
          if(!!isIdadeOssea && !sexo) {
            toast.error('Selecione o sexo referente à idade óssea')
            return
          }
          handleClick()
        }}>Avançar</Button>
    </div>
  );
};
