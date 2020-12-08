<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddUser">添加用户</el-button>

    <el-table :data="usersList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="用户名" width="220">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="昵称" width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="会员">
        <template slot-scope="scope">
          {{ scope.row.member ? '✔' : '✖' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="余额">
        <template slot-scope="scope">
          {{ scope.row.money }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='编辑用户'?'编辑用户':'新增用户'">
      <el-form :model="user" label-width="80px" label-position="left">
        <el-form-item label="用户名">
          <el-input v-model="user.username" placeholder="用户名" />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="user.name" placeholder="昵称" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="user.email" placeholder="邮箱" />
        </el-form-item>
        <el-form-item label="角色">
          <el-cascader
            v-model="user.roles"
            :options="rolesList"
            :props="roleProps"
            placeholder="请选择角色"
            clearable
            collapse-tags
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmUser">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { getUsers, addUser, deleteUser, updateUser } from '@/api/rbac/user'
import { getRoles } from '@/api/rbac/role'
const defaultUser = {
  username: '',
  name: '',
  email: '',
  roles: ''
}

export default {
  data() {
    return {
      user: Object.assign({}, defaultUser),
      usersList: [],
      rolesList: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      roleProps: {
        value: 'name',
        label: 'code',
        multiple: true
      }
    }
  },
  created() {
    // Mock: get all users list from server
    this.getUsers()
    this.getRoles()
  },
  methods: {
    async getRoles() {
      const res = await getRoles()
      this.rolesList = res.data
    },
    async getUsers() {
      const res = await getUsers()
      this.usersList = res.data
    },
    handleAddUser() {
      this.user = Object.assign({}, defaultUser)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      console.log(scope.row)
      this.dialogType = '编辑用户'
      this.dialogVisible = true
      this.checkStrictly = true
      this.user = deepClone(scope.row)
    },
    handleDelete({ $index, row }) {
      this.$confirm('确认删除该用户么?', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deleteUser(row.key)
          this.usersList.splice($index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(err => { console.error(err) })
    },
    async confirmUser() {
      const isEdit = this.dialogType === '编辑用户'
      if (isEdit) {
        await updateUser(this.user.id, this.user)
      } else {
        const { data } = await addUser(this.user)
        this.user.id = data.id
        this.usersList.push(this.user)
      }
      const { username, name, email } = this.user
      this.dialogVisible = false
      this.$notify({
        title: '成功',
        dangerouslyUseHTMLString: true,
        message: `
            <div>用户名 : ${username}</div>
            <div>昵称 : ${name}</div>
            <div>密码 : 'changeme'}</div>
            <div>邮箱 : ${email}</div>
          `,
        type: 'success'
      })
    }

  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .users-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
