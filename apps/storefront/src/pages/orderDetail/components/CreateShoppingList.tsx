import {
  useRef,
} from 'react'

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Button,
  Divider,
} from '@mui/material'

import {
  useForm,
} from 'react-hook-form'
import {
  useMobile,
} from '@/hooks'

import {
  B3CustomForm,
} from '@/components'

import {
  createB2BShoppingList,
} from '@/shared/service/b2b'

const list = [
  {
    name: 'name',
    label: 'Name',
    required: true,
    default: '',
    fieldType: 'text',
    xs: 12,
    variant: 'filled',
    size: 'small',
  },
  {
    name: 'description',
    label: 'Description',
    required: false,
    default: '',
    fieldType: 'multiline',
    xs: 12,
    variant: 'filled',
    size: 'small',
    rows: 4,
  },
]

interface CreateShoppingListProps {
  open: boolean,
  onChange: ()=>void,
  onClose: ()=>void,
}

const CreateShoppingList = ({
  open,
  onChange,
  onClose,
}: CreateShoppingListProps) => {
  const [isMobile] = useMobile()
  const container = useRef<HTMLInputElement | null>(null)

  const {
    control,
    handleSubmit,
    getValues,
    formState: {
      errors,
    },
    setValue,
  } = useForm({
    mode: 'onSubmit',
  })

  const handleClose = () => {
    onClose()
  }

  const handleConfirm = () => {
    handleSubmit(async (data) => {
      const createShoppingData = {
        ...data,
        status: 'Approved',
      }
      await createB2BShoppingList(createShoppingData)
      onChange()
    })()
  }
  return (
    <Box
      sx={{
        ml: 3,
        cursor: 'pointer',
        width: '50%',
      }}
    >
      <Box
        ref={container}
      />

      <Dialog
        open={open}
        fullWidth
        container={container.current}
        onClose={handleClose}
        fullScreen={isMobile}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            borderBottom: '1px solid #D9DCE9',
          }}
        >
          Create new
        </DialogTitle>
        <DialogContent>
          <Box sx={{
            minHeight: '250px',
            display: 'flex',
            alignItems: 'flex-start',
            paddingTop: '20px',
          }}
          >
            <B3CustomForm
              formFields={list}
              errors={errors}
              control={control}
              getValues={getValues}
              setValue={setValue}
            />
          </Box>
        </DialogContent>

        <Divider />

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleConfirm}
            autoFocus
          >
            save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default CreateShoppingList