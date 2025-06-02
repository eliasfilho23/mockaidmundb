import { FC, useEffect } from "react";
import ReactImageUploading from "react-images-uploading";
import uploadIcon from "../../assets/imgs/icon_upload.png";
import confirmedIcon from "../../assets/imgs/icon_confirm.png";
import {largeSpinner} from '../../assets/spinner'
import { useToast } from "@/hooks/use-toast";

interface CaixaDeUploadProps {
  imagem: any;
  setImagem: (imagem: any) => void;
  serverResponseStatus?: string;
}

export const CaixaDeUpload: FC<CaixaDeUploadProps> = (props) => {
  const { imagem, setImagem, serverResponseStatus } = props;
  const {toast} = useToast()

  const handleUploadedImgSize = (imageList: any) => {
    if(imageList[0].file.size > 4194304) {
      toast.error('O tamanho máximo da imagem deve ser 4MB.')
      return false
    }
    setImagem(imageList);
    return true
  };

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      if (serverResponseStatus !== "unrequested" || !event.clipboardData) {
        return;
      }

      const items = event.clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === "file" && item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            event.preventDefault();

            const reader = new FileReader();
            reader.onloadend = () => {
              const newImageArr = [{
                file: file,
                data_url: reader.result as string,
              }];
              if(!handleUploadedImgSize(newImageArr)) return
              setImagem([newImageArr[0]]);
            };
            reader.readAsDataURL(file);
            break;
          }
        }
      }
    };
    document.addEventListener("paste", handlePaste);
    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, [setImagem, serverResponseStatus]);


  return (
    <div className="z-50 2xl:w-[650px] 2xl:h-[475px] 2xl:min-h-[475px] xl:h-full xl:min-h-[200px] xl:w-[400px] w-[300px] h-fit rounded-md">
      {serverResponseStatus === "unrequested" ? (
        <ReactImageUploading
          value={imagem}
          onChange={handleUploadedImgSize}
          dataURLKey="data_url"
        >
          {({
            imageList,
            onImageUpload,
            // isDragging,
            dragProps,
            // errors
          }) => (
            <div
              className="
                  upload__image-wrapper
                  w-full h-full
                  "
            >
              <button
                className="
                      bg-light-blue 
                      2xl:w-[650px] 2xl:h-[475px] xl:w-[400px] min-w-[300px] h-full min-h-[100px] rounded-md
                      flex justify-center items-center hover:cursor-pointer border-dashed border-gray-500 border-2
                      "
                onClick={onImageUpload}
                {...dragProps}
              >
                {imagem.length < 1 ? (
                  <div className="flex flex-col items-center gap-[18px] 2xl:gap-[10px] justify-center">
                    <img src={uploadIcon} alt="upload_icon" className="2xl:w-12 xl:w-10 w-8" />
                    <div>
                      <h2 className="text-sm 2xl:text-lg font-bold text-blue">
                        Importe seu arquivo
                      </h2>
                      <h3 className="text-gray-500
                       text-xs 2xl:text-lg font-normal">
                        {/* ajustar line-height em 2xl */}
                        Arraste ou clique para fazer upload
                      </h3>
                    </div>
                  </div>
                ) : (
                  <div
                    className="flex flex-col items-center justify-center gap-3
                       2xl:w-[600px] 2xl:h-[400px] xl:w-[300px] xl:h-[200px] w-[200px] h-[100px]
                       "
                  >
                    <img
                      src={imagem[0]["data_url"]}
                      alt=""
                      className="max-w-full max-h-full object-contain"
                    />
                    <p className="text-sm xl:text-md">
                      {imageList[0].file?.name}
                    </p>
                  </div>
                )}
              </button>
              &nbsp;
            </div>
          )}
        </ReactImageUploading>
      ) : serverResponseStatus === "pending" ? (
        <div
        className="
        bg-light-blue  
          2xl:w-[650px] 2xl:h-[475px] xl:h-[300px] xl:w-[400px] w-[300px] h-[200px] rounded-md
          flex justify-center items-center border-dashed border-gray-500 border-2
          "
      >
        <div className="flex flex-col items-center justify-center gap-[18px]">
          <div style={{
            backgroundImage: largeSpinner
          }} className="xl:w-20 xl:h-20 w-16 h-16 bg-no-repeat bg-center bg-contain pb-10"> </div>
          <h2 className="text-sm xl:text-lg font-bold text-blue">Enviando arquivo...</h2>
        </div>
      </div>
      ) : (
        <div
        className="
        bg-light-green 
          2xl:w-[650px] 2xl:h-[475px] xl:h-[300px] xl:w-[400px] w-[300px] h-[200px] rounded-md
          flex justify-center items-center border-dashed border-gray-500 border-2
          "
      >
        <div className="flex flex-col items-center gap-[22px] justify-center">
          <img src={confirmedIcon} alt="upload_icon" className="w-[35%]" />
          <h2 className="text-md xl:text-lg font-bold text-green">Arquivo enviado</h2>
        </div>
      </div>
      )}
    </div>
  );
};
